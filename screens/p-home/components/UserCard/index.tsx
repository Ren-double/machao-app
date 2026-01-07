import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import { GitHubUser } from '../../../../services/github';

interface Props {
  user: GitHubUser;
  onPress: () => void;
}

const UserCard: React.FC<Props> = ({ user, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{user.login}</Text>
        <Text style={styles.type}>{user.type}</Text>
      </View>
      <FontAwesome6 name="chevron-right" size={16} color="#9ca3af" style={styles.arrow} />
    </TouchableOpacity>
  );
};

export default UserCard;
