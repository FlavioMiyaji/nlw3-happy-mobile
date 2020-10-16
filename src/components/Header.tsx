import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  cancelShown?: boolean;
}

export default function Header({ title, cancelShown = true }: HeaderProps) {
  const navigation = useNavigation();
  function handlerGoBackHomePage() {
    navigation.navigate('OrphanagesMap');
  }

  return (
    <View style={styles.container} >
      <BorderlessButton onPress={navigation.goBack}>
        <Feather name="arrow-left" size={24} color="#15b6d6" />
      </BorderlessButton>
      <Text style={styles.title}>
        {title}
      </Text>
      {cancelShown
        ? (
          <BorderlessButton onPress={handlerGoBackHomePage}>
            <Feather name="x" size={24} color="#ff669d" />
          </BorderlessButton>
        ) : (
          <View />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9fafc',
    borderBottomWidth: 1,
    borderColor: '#dde3f0',
    paddingTop: 44,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Nunito_600SemiBold',
    color: '#8fa7b3',
    fontSize: 16,
  },
});