import React from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {RNS3} from 'react-native-aws3';
import {GiftedChat} from 'react-native-gifted-chat';
import {launchImageLibrary} from 'react-native-image-picker';
import {Navigation} from 'react-native-navigation';
import {TextInput} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import {useGlobal} from 'reactn';
import {fcmService} from '../../notifications/FCMService';
import {storeMessages} from '../../shared/asyncStorage';
import {webSocket} from '../../sockets';
import {showOverlay} from '../../navigation/functions';
import ApproveDecline from './ApproveDecline';

export default function Chat({id, prevMessages, componentId, setTransaction}) {
  const [messages, setMessages] = React.useState(prevMessages);
  const [message, setMessage] = React.useState('');
  const adminId = '6030066eace592fe6ba705a7';
  // const adminId = '6030f1846953581aff77df42';
  const [user] = useGlobal('user');
  const [isAdmin] = useGlobal('isAdmin');

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
      children: () => (
        <ApproveDecline id={id} setTransaction={setTransaction} />
      ),
      height: constants.height * 0.25,
    });
  };

  React.useEffect(() => {
    const unsubscribe = webSocket.socket.on('getMessageFromAdmin', (data) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, data),
      );
      storeMessages(messages);
    });
    return () => unsubscribe;
  }, []);

  const handleSend = (image) => {
    const _message = {
      _id: adminId,
      text: message,
      createdAt: new Date(),
      user: {
        _id: user._id,
        name: user.name,
      },
      image,
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, _message),
    );
    setMessage('');
    if (!image) {
      handleSendMessage(_message);
    }
    storeMessages(messages);
  };

  const handleSendImage = (image) => {
    const _message = {
      _id: adminId,
      text: message,
      createdAt: new Date(),
      user: {
        _id: user._id,
        name: user.name,
      },
      image,
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, _message),
    );
    setMessage('');
    handleSendMessage(_message, image);
    storeMessages(messages);
  };

  const handleSendMessage = (_message, image) => {
    webSocket.sendMessageToAdmin({message: _message, id});
    handleSendNotification(image);
  };

  const handleSendNotification = async (image) => {
    const adminUser = await webSocket.getUserById(adminId);
    fcmService.sendNotification(
      data,
      [adminUser.notificationId],
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
        handleSend(imgObject.uri);
        handleUploadImage(response);
      }
    });
  };

  const handleUploadImage = async (imgObject) => {
    const {accessKey, secretKey} = await webSocket.socket.request('getAwsKeys');
    const config = {
      keyPrefix: user._id,
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
    ).then(async (response) => {
      if (response.status === 201) {
        handleSendImage(response.body.postResponse.location);
      }
    });
  };

  const onChangeText = (text) => setMessage(text);

  const renderInputToolbar = () => (
    <View style={styles.textInput}>
      <TextInput
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
      <TouchableOpacity onPress={handleImage}>
        <Feather
          name="image"
          size={20}
          color="white"
          style={{marginHorizontal: 8}}
        />
      </TouchableOpacity>
      {message !== '' ? (
        <TouchableOpacity onPress={handleSend} style={{marginRight: 5}}>
          <Feather name="send" size={20} color="white" />
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{flex: 1, marginBottom: constants.height * 0.05}}>
        <GiftedChat
          messages={messages}
          user={{
            _id: user._id,
            name: user.name,
          }}
          renderInputToolbar={renderInputToolbar}
        />
      </View>
    </SafeAreaView>
  );
}

const moreIcon = () => (
  <Feather name="more-horizontal" size={20} color="white" />
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,

    backgroundColor: constants.primary,
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
