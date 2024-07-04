

import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native'; 
import SQLite from 'react-native-sqlite-storage';
import { BackHandler } from 'react-native';
import Toast from 'react-native-simple-toast';

const db = SQLite.openDatabase({ name: 'mydb.db', location: 'default' });

class InsertData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '', // Employee ID (for editing)
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      contactNo: '',
      address: '',
    };
    this.backButtonClick = this.backButtonClick.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backButtonClick);
    const { itemId } = this.props.route.params;
    if (itemId) {
      // Load data for editing if itemId is provided
      this.loadData(itemId);
      console.log('itemId', itemId);
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backButtonClick);
  }

  backButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  handleInputChange = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSave = () => {
    console.log('handleSave');
    const { id, email, password, firstname, lastname, contactNo, address } = this.state;

    if (!email || !firstname || !contactNo || !address) {
      Alert.alert('Error', 'Please enter all required fields');
      return;
    }

    db.transaction((tx) => {
      if (id) {
        // Update existing record
        tx.executeSql(
          'UPDATE MyTable SET user_email=?, user_password=?, user_firstname=?, user_lastname=?, user_contact=?, user_address=? WHERE id=?',
          [email, password, firstname, lastname, contactNo, address, id],
          (tx, result) => {
            console.log('Data updated successfully');
            Toast.show('Data updated successfully');
            this.props.navigation.navigate('ViewPage');
          },
          (error) => {
            console.log('Error in updating data:', error);
            Alert.alert('Error', 'Failed to update data');
          }
        );
      } else {
        // Insert new record
        tx.executeSql(
          'INSERT INTO MyTable (user_email, user_password, user_firstname, user_lastname, user_contact, user_address) VALUES (?,?,?,?,?,?)',
          [email, password, firstname, lastname, contactNo, address],
          (tx, result) => {
            console.log('Data inserted successfully');
            Toast.show('Data inserted successfully');
            this.setState({
              firstname: '',
              lastname: '',
              email: '',
              password: '',
              contactNo: '',
              address: '',
            });
          },
          (error) => {
            console.log('Error in inserting data:', error);
            Alert.alert('Error', 'Failed to save data');
          }
        );
      }
    });
  };

  loadData = (itemId) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM MyTable WHERE id = ?',
        [itemId],
        (tx, resultSet) => {
          if (resultSet.rows.length > 0) {
            const { user_firstname, user_lastname, user_email, user_password, user_contact, user_address } = resultSet.rows.item(0);
            this.setState({
              id: itemId,
              firstname: user_firstname,
              lastname: user_lastname,
              email: user_email,
              password: user_password,
              contactNo: user_contact.toString(),
              address: user_address,
            });
            console.log('Name', firstname);
          }
        },
        (error) => {
          console.log('Error in loading data:', error);
        }
      );
    });
  };

  render() {
    const { firstname, lastname, email, password, contactNo, address } = this.state;

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => this.props.navigation.goBack()}>
            <Image
              source={require('./assets/back_arrow.png')}
              style={styles.backImage}
            />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.headerText}>Edit the Profile</Text>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>First Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your First Name"
            onChangeText={(text) => this.handleInputChange('firstname', text)}
            value={firstname}
          />

          <Text style={styles.label}>Last Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Last Name"
            onChangeText={(text) => this.handleInputChange('lastname', text)}
            value={lastname}
          />

          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Email"
            onChangeText={(text) => this.handleInputChange('email', text)}
            value={email}
          />

          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Password"
            onChangeText={(text) => this.handleInputChange('password', text)}
            value={password}
            secureTextEntry
          />

          <Text style={styles.label}>Contact No:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Contact No"
            onChangeText={(text) => this.handleInputChange('contactNo', text)}
            value={contactNo}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Address:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Address"
            onChangeText={(text) => this.handleInputChange('address', text)}
            value={address}
          />

          <TouchableOpacity style={styles.button} onPress={this.handleSave}>
            <Text style={{ color: '#fff', fontFamily: 'Roboto-Medium' }}>
              {this.state.id ? 'Update' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  // input: {
  //   height: 40,
  //   width: '100%',
  //   borderColor: '#ddd',
  //   borderWidth: 1,
  //   marginBottom: 20,
  //   paddingHorizontal: 10,
  //   backgroundColor: '#fff',
  // },


  input: {
    height: 40,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#0f76ae',
  },






  button: {
    width: '60%',
    height: 45,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f76ae',
    borderRadius: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: '#0f76ae',
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backImage: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: '#333',
    fontSize: 16,
  },
});

export default InsertData;

