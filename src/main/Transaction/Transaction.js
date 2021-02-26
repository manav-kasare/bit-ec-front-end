import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  RefreshControl,
} from 'react-native';
import {List} from 'react-native-paper';
import {useGlobal} from 'reactn';
import {push} from '../../navigation/functions';
import {webSocket} from '../../sockets';

export default function Transaction({componentId}) {
  const [user, setUser] = useGlobal('user');
  const [refreshing, setRefreshing] = React.useState(false);

  const renderItem = ({item}) => <Tile id={item} componentId={componentId} />;

  const renderTrade = ({item}) => (
    <TradeTile id={item} componentId={componentId} />
  );

  const onRefresh = async () => {
    const response = await webSocket.getUserById(user._id);
    if (!response.err) setUser(response.user);
    setRefreshing(false);
  };

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      style={{backgroundColor: constants.primary}}
      tintColor="white"
      size={Platform.os === 'ios' ? 'small' : 'default'}
    />
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headingView}>
        <Text style={styles.heading}>Transactions</Text>
      </View>
      <View style={styles.content}>
        <FlatList
          data={user.transactions}
          renderItem={renderItem}
          key={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={refreshControl}
        />
        <View style={styles.headingView}>
          <Text style={styles.heading}>Trades</Text>
        </View>
        <FlatList
          data={user.trades}
          renderItem={renderTrade}
          key={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={refreshControl}
        />
      </View>
    </SafeAreaView>
  );
}

const ItemSeparatorComponent = () => <View style={styles.seperator} />;
const ListEmptyComponent = () => (
  <View
    style={{
      width: constants.width,
      height: constants.height * 0.25,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text style={{color: 'grey'}}>None</Text>
  </View>
);

const Tile = ({id, componentId}) => {
  const [transaction, setTransaction] = React.useState({
    amount: null,
    atPrice: null,
    type: '',
    status: '',
    messages: [],
  });

  React.useEffect(() => {
    handleGetTransaction();
  }, []);

  const handleGetTransaction = async () => {
    const response = await webSocket.getTransaction(id);
    if (!response.err) setTransaction(response.transaction);
  };

  const title = `${transaction.amount / transaction.atPrice} BTC`;

  const onPress = () => {
    push(componentId, 'Chat', {
      id: id,
      prevMessages: transaction.messages,
      setTransaction: setTransaction,
    });
  };

  const right = () => (
    <View
      style={{alignItems: 'center', justifyContent: 'center', marginRight: 15}}>
      <Text
        style={{
          color:
            transaction.status === 'approved'
              ? '#37b526'
              : transaction.status === 'pending'
              ? 'yellow'
              : '#E33F64',
        }}>
        {transaction.status && transaction.status.toUpperCase()}
      </Text>
    </View>
  );

  return (
    <>
      <List.Item
        title={title}
        titleStyle={{color: 'white', fontSize: 25, fontWeight: '700'}}
        description={transaction.type.toUpperCase()}
        descriptionStyle={{
          color: transaction.type === 'buy' ? '#37b526' : '#E33F64',
        }}
        onPress={onPress}
        style={styles.tile}
        right={right}
      />
      <ItemSeparatorComponent />
    </>
  );
};

const TradeTile = ({id, componentId}) => {
  const [trade, setTrade] = React.useState({
    type: '',
    atPrice: null,
    amount: null,
    status: '',
  });

  React.useEffect(() => {
    handleGetTrade();
  }, []);

  const handleGetTrade = async () => {
    const response = await webSocket.getTrade(id);
    if (!response.err) setTrade(response.trade);
  };

  const title = `${trade.amount / trade.atPrice} BTC`;

  const right = () => (
    <View
      style={{alignItems: 'center', justifyContent: 'center', marginRight: 15}}>
      <Text
        style={{
          color:
            trade.status === 'approved'
              ? '#37b526'
              : trade.status === 'pending'
              ? 'yellow'
              : '#E33F64',
        }}>
        {trade.status && trade.status.toUpperCase()}
      </Text>
    </View>
  );

  const onPress = () => {
    push(componentId, 'Chat', {
      id: id,
      prevMessages: trade.messages,
      setTransaction: setTrade,
    });
  };

  return (
    <>
      <List.Item
        title={title}
        titleStyle={{color: 'white', fontSize: 25, fontWeight: '700'}}
        description={trade.type.toUpperCase()}
        descriptionStyle={{
          color: trade.type === 'buy' ? '#37b526' : '#E33F64',
        }}
        onPress={onPress}
        style={styles.tile}
        right={right}
      />
      <ItemSeparatorComponent />
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: constants.primary,
  },
  seperator: {
    height: 0.3,
    width: constants.width * 0.95,
    position: 'relative',
    left: constants.width * 0.05,
    backgroundColor: 'grey',
  },
  headingView: {
    width: constants.width,
    paddingLeft: 25,
    marginBottom: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: 'white',
  },
  content: {
    // flex: 1,
  },
  tile: {
    height: constants.height * 0.1,
    width: constants.width,
    alignItems: 'center',
  },
});
