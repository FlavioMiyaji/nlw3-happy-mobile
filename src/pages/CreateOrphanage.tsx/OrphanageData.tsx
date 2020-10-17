import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  Switch,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import api from '../../services/api';

interface OrphanageDataParams {
  position: {
    latitude: number;
    longitude: number;
  };
}

export default function OrphanageData() {
  const { params } = useRoute();
  const { position } = params as OrphanageDataParams;
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenWeekends] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleSelectImages = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('', 'To upload images to the orphanage, we need access to your photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (result.cancelled) {
      return;
    }
    const { uri: image } = result;
    setImages(images => [...images, image]);
  }, []);

  const handlerRemoveImage = useCallback((uri: string) => {
    setImages(images => images.filter(image => image !== uri));
  }, []);

  const handleSubmit = async () => {
    const { latitude, longitude } = position;
    const data = new FormData();
    data.append('name', name);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('about', about);
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));
    images.forEach((image, index) => {
      data.append('images', {
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: image,
      } as any);
    });

    try {
      await api.post('orphanages', data);
      Alert.alert('Success!', 'The orphanage was saved.', [{
        text: 'Ok',
        onPress: () => navigation.navigate('OrphanagesMap'),
      }], { cancelable: false });
    } catch (err) {
      Alert.alert('', err.message);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Data</Text>

      <View style={styles.separator} />

      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>About *</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={about}
        onChangeText={setAbout}
      />
      <Text style={styles.about}>Maximum 300 characters</Text>
      {/*
      <Text style={styles.label}>Whatsapp</Text>
      <TextInput
        style={styles.input}
      />
      */}
      <Text style={styles.label}>Photos *</Text>
      <View style={styles.uploadedImagesContainer}>
        {images.map(uri => (
          <TouchableOpacity
            key={uri}
            onPress={() => handlerRemoveImage(uri)}
          >
            <Image
              source={{ uri }}
              style={styles.uploadedImage}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.imagesInput} onPress={handleSelectImages}>
        <Feather name="plus" size={24} color="#15B6D6" />
      </TouchableOpacity>

      <Text style={styles.title}>Visitation</Text>

      <View style={styles.separator} />

      <Text style={styles.label}>Instructions *</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={instructions}
        onChangeText={setInstructions}
      />

      <Text style={styles.label}>Opening hours *</Text>
      <TextInput
        style={styles.input}
        value={opening_hours}
        onChangeText={setOpeningHours}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Open on weekend</Text>
        <Switch
          thumbColor="#fff"
          trackColor={{ false: '#ccc', true: '#39CC83' }}
          value={open_on_weekends}
          onValueChange={setOpenWeekends}
        />
      </View>
      <View style={styles.separator} />
      <RectButton style={styles.nextButton} onPress={handleSubmit}>
        <Text style={styles.nextButtonText}>Save</Text>
      </RectButton>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 24,
    paddingBottom: 48,
  },

  title: {
    color: '#5c8599',
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    borderBottomWidth: 0.8,
    borderBottomColor: '#D3E2E6',
  },

  separator: {
    height: 0.8,
    width: '100%',
    backgroundColor: '#D3E2E6',
    marginVertical: 24,
  },

  label: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  about: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_600SemiBold',
  },

  comment: {
    fontSize: 11,
    color: '#8fa7b3',
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1.4,
    borderColor: '#d3e2e6',
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    textAlignVertical: 'top',
  },

  uploadedImagesContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },

  uploadedImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginRight: 8,
  },

  imagesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderColor: '#96D2F0',
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  }
})