import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, FlatList } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import NetInfo from '@react-native-community/netinfo';

const App = () => {
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState([]);
  const storage = new MMKV();
  const NOTES_KEY = 'notes';
  const handleAddNote = () => {
  // Ajouter la note dans MMKV et mettre à jour l'état
  const currentNotes = JSON.parse(storage.getString(NOTES_KEY) || '[]');
    const updatedNotes = [...currentNotes, noteText];
    storage.set(NOTES_KEY, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
    setNoteText('');
  };

  const syncData = () => {
   // Vérifier la connexion et synchroniser les données avec l'API
   // DONE
   NetInfo.fetch().then(state => {
    console.log("Type de connexion: ", state.type);
    console.log("Connecté: ", state.isConnected);
    if (state.isConnected) {
      console.log("Connected!")
    }
   })
  };
  useEffect(() => {
  // Charger les notes depuis MMKV
  const storedNotes = JSON.parse(storage.getString(NOTES_KEY) || '[]');
  setNotes(storedNotes);
  // const note = storage.getString(noteText);
  // console.log(note);

  // Configurer la vérification périodique de la connexion Internet
  // DONE
  setInterval(syncData, 1000)
  }, []);
  return (
  // Interface utilisateur pour ajouter et afficher les notes
  <View>
    <TextInput
        placeholder="Note"
        value={noteText}
        onChangeText={setNoteText}
      />
      <Button title='Ajouter note' onPress={handleAddNote} />
      <FlatList
        data={notes}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
  </View>
  );
 };
 export default App;