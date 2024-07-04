import React, { Component } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
  Alert
 } from 'react-native';
import { BackHandler } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Toast from 'react-native-simple-toast';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const db = SQLite.openDatabase({ name: 'mydb.db', location: 'default' });
class DeleteData extends Component {
  constructor(props) {
    super(props);
    this.backButtonClick = this.backButtonClick.bind(this);
    this.state = {
      deleteId: '', // State to store the delete ID entered by the user
    };
  }
 
  componentDidMount = () =>{
    BackHandler.addEventListener('hardwareBackPress', this.backButtonClick);
  }

  componentWillUnmount = () =>{
    BackHandler.removeEventListener('hardwareBackPress', this.backButtonClick);
  }

  
  backButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }


  handleDelete = () => {
    // Add your delete logic here using this.state.deleteId
    const { deleteId } = this.state;
    console.log('Delete button pressed with ID:', deleteId);

    if (!deleteId) {
      Alert.alert('Error', 'Please enter a valid ID to delete.');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM MyTable WHERE id = ?',
        [deleteId],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            Toast.show('Data Deleted successfully');
            // Alert.alert('Success', `Record with ID ${deleteId} deleted successfully.`);
            this.setState({ deleteId: '' }); // Clear input field after successful delete
          } else {
            Alert.alert('Error', `Record with ID ${deleteId} not found.`);
          }
        },
        error => {
          console.log('Error deleting record: ', error);
        }
      );
    });
  };
  
  render() {
    return (
      <>

<View style={{flexDirection: 'row', width: windowWidth, height: 50,backgroundColor:(this.state.switchValue ? '#000' : '#D2E6FE')}}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                style={{height: 45, width: 100}}
                onPress={() => this.props.navigation.goBack()}>
                <Image
                  source={require('./assets/dashback.png')}
                  style={{width: 50, height: 25, marginLeft: 10, marginTop: 10}}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: windowWidth - 200,
              }}>
              <Text style={{color: (this.state.switchValue ? '#0080ff' : '#000'), fontSize: 20, fontWeight: 'bold'}}>
                 DELETE 
              </Text>
            </View>
          </View>

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter the delete id"
            placeholderTextColor="#379ee6"
            underlineColorAndroid="transparent"
            textColor="#339933"
            fontSize={21}
            value={this.state.deleteId}
            onChangeText={(text) => this.setState({ deleteId: text })}
          />
          <Button
            title="DELETE"
            onPress={this.handleDelete}
            style={styles.deleteButton}
          />
        </View>
      </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    width: '100%',
    marginTop: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#379ee6',
    borderWidth: 1,
    color: '#339933',
    fontSize: 21,
    paddingHorizontal: 10,
  },
  deleteButton: {
    width: 100,
    height: 50,
    marginTop: 30,
    alignSelf: 'center',
  },
});

export default DeleteData;
