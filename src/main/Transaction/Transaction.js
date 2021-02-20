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
          refreshControl={refreshControl}
        />
      </View>
    </SafeAreaView>
  );
}

const ItemSeparatorComponent = () => <View style={styles.seperator} />;

const Tile = ({id, componentId}) => {
  const [transaction, setTransaction] = React.useState({
    numberOfBitcoins: 0,
    atPrice: 0,
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

  const title = `${transaction.numberOfBitcoins} BTC at $ ${transaction.atPrice}`;

  const onPress = () => {
    push(componentId, 'Chat', {
      transactionId: id,
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
    fontWeight: '900',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingBottom: constants.height * 0.05,
  },
  tile: {
    height: constants.height * 0.1,
    width: constants.width,
    alignItems: 'center',
  },
});
