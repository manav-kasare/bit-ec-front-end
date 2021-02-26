import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Animated from 'react-native-reanimated';
import {SceneMap, TabView} from 'react-native-tab-view';
import Buy from './Buy';
import Sell from './Sell';
import Feather from 'react-native-vector-icons/Feather';
import {showOverlay} from '../../../navigation/functions';
import BuyOrSell from './BuyOrSell';

const FirstRoute = () => <Buy />;
const SecondRoute = () => <Sell />;

export default function Trade({componentId}) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Buy'},
    {key: 'second', title: 'Sell'},
  ]);

  React.useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: 'Trade',
          fontSize: 25,
          fontWeight: '700',
        },
        borderColor: 'transparent',
        backButton: {
          showTitle: false,
          color: 'white',
        },
        rightButtons: [
          {
            id: 'More',
            component: {
              name: 'CustomTopBarButton',
              passProps: {
                onPress: handleMore,
                child: moreIcon,
              },
            },
          },
        ],
      },
    });
  }, []);

  const handleMore = () => {
    showOverlay('CustomModal', {
      children: () => <BuyOrSell />,
      height: constants.height * 0.25,
    });
  };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = (props) => (
    <View style={styles.tabBar}>
      {props.navigationState.routes.map((route, i) => {
        return (
          <TouchableWithoutFeedback onPress={() => setIndex(i)}>
            <View style={styles.tabItem}>
              <Animated.Text style={{color: index === i ? 'white' : 'grey'}}>
                {route.title}
              </Animated.Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={constants.width}
      renderTabBar={renderTabBar}
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: constants.primary,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
const moreIcon = () => (
  <Feather
    name="more-horizontal"
    size={20}
    color="white"
    style={{marginRight: 15}}
  />
);

Trade.options = {
  topBar: {
    title: {
      text: 'Trade',
      fontSize: 25,
      fontWeight: '700',
    },
    borderColor: 'transparent',
    backButton: {
      showTitle: false,
    },
  },
};
