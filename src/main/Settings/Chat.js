import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {RNS3} from 'react-native-aws3';
import FastImage from 'react-native-fast-image';
import {launchImageLibrary} from 'react-native-image-picker';
import {Navigation} from 'react-native-navigation';
import {ActivityIndicator, TextInput} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import {useGlobal} from 'reactn';
import {showOverlay} from '../../navigation/functions';
import {fcmService} from '../../notifications/FCMService';
import {storeMessages} from '../../shared/asyncStorage';
import {webSocket} from '../../sockets';
import ApproveDecline from './ApproveDecline';
import _ from 'lodash';

export default function Chat({id, type, prevMessages, componentId}) {
  const [messages, setMessages] = React.useState([]);
  // const [messages, setMessages] = React.useState(prevMessages);
  const [message, setMessage] = React.useState('');
  const adminId = '6030066eace592fe6ba705a7';
  // const adminId = '6030f1846953581aff77df42';
  const [user] = useGlobal('user');
  const [isAdmin] = useGlobal('isAdmin');
  const [userId, setUserId] = React.useState(null);
  const [focus, setFocus] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    if (type === 'transaction') {
      handleGetTransactionData();
    } else if (type === 'trade') {
      handleGetTradeData();
    }
  }, []);

  const handleGetTransactionData = async () => {
    const response = await webSocket.getTransaction(id);
    if (!response.err) {
      setUserId(response.transaction.userId);
      handleGetMessages(response.transaction.messages);
    }
  };

  const handleGetMessages = (ids) => {
    if (ids) {
      let _messages = [];
      const promise = ids.map(async (_id) => {
        const response = await webSocket.getMessage(_id);
        if (!response.err)
          _messages.push({
            user: {_id: user._id, name: user.name},
            ...response.message,
          });
      });

      Promise.all(promise).then(() => {
        setMessages(_messages);
      });
    }
  };

  const handleGetTradeData = async () => {
    const response = await webSocket.getTrade(id);
    if (!response.err) {
      if (response.type === 'buy') {
        setUserId(response.trade.creator);
      } else {
        setUserId(response.trade.trader);
      }
    }
  };

  React.useEffect(() => {
    if (isAdmin) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          title: {
            text: 'Chat',
            fontSize: 25,
            fontWeight: '700',
          },
          borderColor: 'transparent',
          backButton: {
            showTitle: false,
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
    } else {
    }
  }, []);

  const handleMore = () => {
    showOverlay('CustomModal', {
      children: () => <ApproveDecline id={id} type={type} />,
      height: constants.height * 0.25,
    });
  };

  React.useEffect(() => {
    const unsubscribe = webSocket.socket.on(
      'getChatMsg',
      _.throttle((data) => {
        console.log('getChatMsg', data);
        setMessages((previousMessages) => previousMessages.concat(data));
        storeMessages(messages);
      }, 500),
    );
    return () => unsubscribe;
  }, []);

  const handleSend = (image) => {
    const _message = image
      ? {
          _id: isAdmin ? userId : adminId,
          text: message,
          createdAt: new Date(),
          user: {
            _id: user._id,
            name: user.name,
          },
          image,
        }
      : {
          _id: isAdmin ? userId : adminId,
          text: message,
          createdAt: new Date(),
          user: {
            _id: user._id,
            name: user.name,
          },
        };
    // const newMessages = messages.concat(_message);
    setMessages((previousMessages) => previousMessages.concat(_message));
    setMessage('');
    if (!image) {
      handleSendMessage(_message);
    }
    storeMessages(messages);
  };

  const handleSendImage = (image) => {
    const _message = {
      _id: isAdmin ? userId : adminId,
      text: message,
      createdAt: new Date(),
      user: {
        _id: user._id,
        name: user.name,
      },
      image,
    };
    setMessages((previousMessages) => previousMessages.concat(_message));
    setMessage('');
    handleSendMessage(_message, image);
    storeMessages(messages);
  };

  const handleSendMessage = (_message, image) => {
    if (!isAdmin) {
      webSocket.sendMessageToAdmin({message: _message, userId, id, type});
      handleSendNotification(image);
    } else {
      webSocket.sendChatMsg({message: _message, userId, id, type});
      handleSendNotification(image);
    }
  };

  const handleSendNotification = async (image) => {
    const _user = await webSocket.getUserById(isAdmin ? userId : adminId);
    fcmService.sendNotification(
      {},
      [_user.notificationId],
      user.name,
      image ? 'Sent you an image' : message,
    );
  };

  const handleImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        imgObject = response;
        handleUploadImage(response);
      }
    });
  };

  const handleUploadImage = async (imgObject) => {
    setUploading(true);
    const {accessKey, secretKey} = await webSocket.socket.request('getAwsKeys');
    const config = {
      keyPrefix: `pictures/${user._id}`,
      bucket: 'bitec-images',
      region: 'us-east-1',
      accessKey: accessKey,
      secretKey: secretKey,
      successActionStatus: 201,
    };

    RNS3.put(
      {
        uri: imgObject.uri,
        name: imgObject.fileName,
        type: imgObject.type.substring(6),
      },
      config,
    )
      .then((response) => {
        console.log('handleUploadImage put response', response);
        if (response.status === 201) {
          setUploading(false);
          handleSendImage(response.body.postResponse.location);
        }
      })
      .catch((err) => {
        setUploading(false);
        console.log('handleImageUpload err', err);
      });
  };

  const onChangeText = (text) => setMessage(text);

  const renderItem = ({item}) =>
    item.user._id === user._id ? (
      <RightBubble message={item} />
    ) : (
      <LeftBubble message={item} />
    );

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: constants.height * 0.025,
          }}>
          <FlatList
            style={{flex: 1}}
            inverted={true}
            data={messages.reverse()}
            key={(item, index) => index.toString()}
            renderItem={renderItem}
          />
          <View style={styles.textInput}>
            <TextInput
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              theme={theme}
              selectionColor="white"
              underlineColorAndroid="transparent"
              underlineColor="transparent"
              mode="flat"
              placeholder="Type here"
              value={message}
              style={styles.textInputMain}
              onChangeText={onChangeText}
              placeholderTextColor="grey"
            />
            {uploading ? (
              <ActivityIndicator size="small" color="white" animating={true} />
            ) : (
              <TouchableOpacity onPress={handleImage}>
                <Feather
                  name="image"
                  size={25}
                  color="white"
                  style={{marginHorizontal: 10}}
                />
              </TouchableOpacity>
            )}

            {message !== '' ? (
              <TouchableOpacity
                onPress={() => handleSend()}
                style={{marginRight: 5}}>
                <Feather name="send" size={25} color="white" />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </View>
        <View style={{height: focus ? constants.height * 0.1 : 0}} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const moreIcon = () => (
  <Feather name="more-horizontal" size={20} color="white" />
);

const onPressImage = (uri) => {
  Navigation.showOverlay({
    component: {
      name: 'FullImage',
      passProps: {uri},
    },
  });
};

const RightBubble = ({message}) => (
  <View style={styles.rightContainer}>
    {message.image ? (
      <TouchableWithoutFeedback onPress={() => onPressImage(message.image)}>
        <View>
          <FastImage
            source={{uri: message.image, priority: FastImage.priority.normal}}
            style={styles.image}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </TouchableWithoutFeedback>
    ) : (
      <>
        <Text style={{color: 'white'}}>{message.name}</Text>
        <View style={styles.rightBubble}>
          <Text style={{color: 'white', fontSize: 16}}>{message.text}</Text>
        </View>
      </>
    )}
  </View>
);

const LeftBubble = ({message}) => (
  <View style={styles.leftContainer}>
    {message.image ? (
      <TouchableWithoutFeedback onPress={() => onPressImage(message.image)}>
        <View>
          <FastImage
            source={{uri: message.image, priority: FastImage.priority.normal}}
            style={styles.image}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </TouchableWithoutFeedback>
    ) : (
      <>
        <Text style={{color: 'white'}}>{message.name}</Text>
        <View style={styles.leftBubble}>
          <Text style={{color: 'black', fontSize: 16}}>{message.text}</Text>
        </View>
      </>
    )}
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: constants.primary,
  },
  image: {
    width: constants.width * 0.5,
    height: constants.height * 0.4,
    marginVertical: 10,
    borderRadius: 10,
  },
  rightContainer: {
    width: constants.width,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
  },
  leftContainer: {
    width: constants.width,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
  },
  rightBubble: {
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: constants.accent,
    marginVertical: 10,
  },
  leftBubble: {
    padding: 10,
    borderRadius: 15,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  textInput: {
    width: constants.width * 0.9,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: constants.height * 0.06,
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 0,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  textInputMain: {
    //   width: constants.width * 0.8,
    flex: 1,
    height: constants.height * 0.06,
    margin: 0,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  sendButton: {
    color: constants.accent,
    fontSize: 20,
    fontWeight: '600',
  },
  headingView: {
    width: constants.width,
    paddingLeft: 25,
    marginBottom: constants.height * 0.05,
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
});

const theme = {
  colors: {
    primary: 'transparent',
    text: 'white',
    background: 'transparent',
  },
};

Chat.options = {
  topBar: {
    title: {
      text: 'Chat',
      fontSize: 25,
      fontWeight: '700',
    },
    borderColor: 'transparent',
    backButton: {
      showTitle: false,
    },
  },
};
