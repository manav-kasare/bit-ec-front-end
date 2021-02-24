import React from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {List} from 'react-native-paper';
import {webSocket} from '../../../sockets';

export default function Sell() {
  const [listings, setListings] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    handleGetData();
  }, []);

  const handleGetData = async () => {
    const response = await webSocket.getBuyListings();
    if (!response.err) setListings(response.listings);
  };

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
    <View style={styles.screen}>
      <FlatList
        data={listings}
        renderItem={renderItem}
        key={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorComponent}
        refreshControl={refreshControl}
      />
    </View>
  );
}

const ItemSeparatorComponent = () => <View style={styles.seperator} />;

const Tile = ({id, componentId}) => {
  const [listing, setListing] = React.useState({
    from: '',
    type: '',
    atPrice: null,
    amount: null,
    createdAt: null,
  });

  React.useEffect(() => {
    handleGetListing();
  }, []);

  const handleGetListing = async () => {
    const response = await webSocket.getListing(id);
    if (!response.err) setListing(response.listing);
  };

  const title = `${listing.amount / atPrice}  BTC`;

  const onPress = () => {
    push(componentId, 'Chat', {
      transactionId: id,
      prevMessages: listing.messages,
      setListing: setListing,
    });
  };

  const handleSell = () => {};

  const right = () => (
    <Button
      color={constants.accent}
      loading={isLoading}
      disabled={isLoading}
      labelStyle={{textTransform: 'none', color: constants.accent}}
      onPress={handleSell}>
      Sell
    </Button>
  );

  return (
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
