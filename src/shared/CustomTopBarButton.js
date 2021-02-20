import React from 'react';
import {TouchableOpacity} from 'react-native';

export default function CustomTopBarButton(props) {
  const Child = props.child;
  return props.button ? (
    <Child />
  ) : (
    <TouchableOpacity onPress={props.onPress} style={{padding: 5}}>
      <Child />
    </TouchableOpacity>
  );
}
