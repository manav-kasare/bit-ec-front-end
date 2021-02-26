import React from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {Button, List} from 'react-native-paper';
import {useGlobal} from 'reactn';
import {push} from '../../../navigation/functions';
import {fcmService} from '../../../notifications/FCMService';
import {storeUser} from '../../../shared/asyncStorage';
import {webSocket} from '../../../sockets';

export default function Buy({componentId}) {
  const [listings, setListings] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    handleGetData();
  }, []);

  const handleGetData = async () => {
    const response = await webSocket.getSellListings();
    if (!response.err) setListings(response.listings);
  };

  const renderItem = ({item}) => <Tile id={item} componentId={componentId} />;

  const onRefresh = async () => {
    const response = await webSocket.getSellListings();
    if (!response.err) setListings(response.listings);
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
    <View style={styles.screen}>
      <FlatList
        data={listings}
        renderItem={renderItem}
        key={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={refreshControl}
      />
    </View>
  );
}

const ItemSeparatorComponent = () => <View style={styles.seperator} />;

const ListEmptyComponent = () => (
  <View
    style={{
      flex: 1,
      height: constants.height * 0.8,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text style={{color: 'grey'}}>No trades listed</Text>
  </View>
);

const Tile = ({id, componentId}) => {
  const [listing, setListing] = React.useState({
    from: '',
    type: '',
    atPrice: null,
    amount: null,
    createdAt: null,
  });

  const [user, setUser] = useGlobal('user');
  const [isLoading, setIsLoading] = React.useState(false);
  const [already, setAlready] = React.useState(false);

  React.useEffect(() => {
    user.trades.indexOf(id) !== -1 && setAlready(true);
    handleGetListing();
  }, []);

  const handleGetListing = async () => {
    const response = await webSocket.getListing(id);
    if (!response.err) {
      response.listing.from === user._id && setAlready(true);
      setListing(response.listing);
    }
  };

  const title = `${(listing.amount / listing.atPrice)
    .toString()
    .slice(0, -10)}  BTC`;

  const handleBuy = async () => {
    setIsLoading(true);
    const response = await webSocket.trade({
      creator: listing.from,
      type: listing.type,
      atPrice: listing.atPrice,
      amount: listing.amount,
      status: 'pending',
      createdAt: listing.createdAt,
    });
    if (!response.err) {
      setAlready(true);
      setUser(response.user);
      push(componentId, 'Chat', {
        id: response.tradeId,
        type: 'trade',
        prevMessages: [],
      });
      const adminRes = await webSocket.getAdmin();
      if (!adminRes.err) {
        fcmService.sendNotification(
          {},
          [adminRes.notificationId],
          `${user.name}: Buy trade request`,
          `${listing.amount / listing.atPrice} BTC`,
        );
        webSocket.notifyAdmin({
          title: `${user.name}: Buy trade request`,
          description: `${listing.amount / listing.atPrice} BTC`,
        });
      }
      setIsLoading(false);
      storeUser(response.user);
    } else setIsLoading(false);
  };

  const right = () => (
    <Button
      color={constants.accent}
      loading={isLoading}
      disabled={isLoading}
      labelStyle={{textTransform: 'none', color: constants.accent}}
      onPress={handleBuy}>
      Buy
    </Button>
  );

  return !already ? (
    <>
      <List.Item
        title={title}
        titleStyle={{color: 'white', fontSize: 25, fontWeight: '700'}}
        description={`At price: ${listing.atPrice}`}
        descriptionStyle={{color: 'grey'}}
        onPress={onPress}
        style={styles.tile}
        right={right}
      />
      <ItemSeparatorComponent />
    </>
  ) : (
    <></>
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
    justifyContent: 'center',
  },
});
