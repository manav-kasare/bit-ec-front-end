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

export default function Trades({componentId}) {
  const [user, setUser] = useGlobal('user');
  const [refreshing, setRefreshing] = React.useState(false);

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
      <FlatList
        data={user.trades}
        renderItem={renderTrade}
        key={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={refreshControl}
      />
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
        titleStyle={{color: 'white', fontSize: 20, fontWeight: '700'}}
        description={trade.type.toUpperCase()}
        descriptionStyle={{
          color: trade.type === 'buy' ? '#37b526' : '#E33F64',
        }}
        disabled={trade.type !== 'buy'}
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
    paddingLeft: 15,
    marginTop: 50,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: 'white',
  },
  tile: {
    height: constants.height * 0.1,
    width: constants.width,
    alignItems: 'center',
  },
});

Trades.options = {
  topBar: {
    title: {
      text: 'Trades',
      fontSize: 25,
      fontWeight: '700',
    },
    borderColor: 'transparent',
    backButton: {
      showTitle: false,
    },
  },
};
