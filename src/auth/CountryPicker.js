import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {List, Searchbar} from 'react-native-paper';
import countries from '../assets/countries.json';
const countriesArray = Object.keys(countries);

export default function CountryPicker({setCountry}) {
  const [query, setQuery] = React.useState('');
  const [filteredArray, setFilteredArray] = React.useState([]);

  React.useEffect(() => {
    setFilteredArray(countriesArray);
  }, []);

  const handleOnPress = (item) => {
    Navigation.dismissAllOverlays();
    setCountry(item);
  };

  const handleSearch = (q) => {
    const formatted = q.substr(0, 1).toUpperCase() + q.substr(1, q.length);
    setFilteredArray(
      countriesArray.filter((country) =>
        countries[country].name.common.includes(formatted),
      ),
    );
  };

  const left = (_country) => (
    <View style={{marginTop: 5, width: 50}}>
      <Text style={{color: 'black'}}>
        +{countries[_country].callingCode[0]}
      </Text>
    </View>
  );

  const renderItem = ({item}) =>
    countries[item].callingCode[0] ? (
      <>
        <List.Item
          title={countries[item].name.common}
          titleStyle={{fontWeight: '500'}}
          left={() => left(item)}
          onPress={() => handleOnPress(item)}
        />
        <View style={styles.seperator} />
      </>
    ) : (
      <></>
    );

  const onChangeText = (text) => {
    setQuery(text);
    handleSearch(text);
  };

  const listHeaderComponent = (
    <View style={styles.header}>
      <Searchbar
        value={query}
        style={styles.searchBar}
        textInputStyle={styles.searchBarInput}
        placeholder="Search"
        iconColor="black"
        onChangeText={onChangeText}
      />
    </View>
  );

  return (
    <View style={styles.modal}>
      <FlatList
        style={styles.flatList}
        data={filteredArray}
        keyExtractor={(index) => index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={listHeaderComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: constants.width,
    height: constants.height * 0.75,
    backgroundColor: 'white',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 0,
  },
  flatList: {
    flex: 1,
    width: constants.width,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: constants.width,
    paddingHorizontal: 10,
  },
  searchBar: {
    width: constants.width * 0.9,
    // height: 40,
    shadowOpacity: 0,
    elevation: 0,
    shadowColor: 'transparent',
    borderBottomWidth: 0.3,
    borderBottomColor: 'grey',
  },
  searchBarInput: {
    color: 'black',
  },
});
