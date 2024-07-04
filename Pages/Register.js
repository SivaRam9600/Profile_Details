
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { BackHandler } from 'react-native';
import Toast from 'react-native-simple-toast';

const windowWidth = Dimensions.get('window').width;

const db = SQLite.openDatabase({ name: 'mydb.db', location: 'default' });

class InsertData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      email:'',
      password:'',
      lastname:'',
      age: '',
      contactNo: '',
      address: '',
      logintime: '',
      logout: '',
    };
    this.backButtonClick = this.backButtonClick.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backButtonClick);
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

  handleInputChangeName = (key, value) => {
    const onlyLetters = /^[a-zA-Z\s]*$/;
    if (onlyLetters.test(value) || value === '') {
      this.setState({ [key]: value });
    }
  };

  handleInputLastName = (key, value) =>{
    this.setState({ lastname: value });
  }

  handleInputemailaddress = (key, value) => {
    this.setState({ email: value });
  };

  handleInputpassword = (key, value) =>{
    this.setState({ password: value });
  }

  handleChangeAge = (key, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 3) {
      this.setState({ [key]: numericValue });
    }
  };

  handleChangeMobNum = (key, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 10) {
      this.setState({ [key]: numericValue });
    }
  };

  address = (value) => {
    this.setState({ address: value });
  };

  handleSave = () => {
    console.log('handleSave');

    const { id, email, password, name, lastname, contactNo, address } = this.state;

    if (!name || !contactNo || !address || !password || !email || !lastname) {
      Alert.alert('Error', 'Please enter all required fields');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM MyTable WHERE id = ?',
        [id],
        (tx, resultSet) => {
          if (resultSet.rows.length > 0) {
            Alert.alert('Error', 'User ID already exists');
          } else {
            db.transaction((tx) => {
              tx.executeSql(
                'INSERT INTO MyTable (user_email, user_password, user_firstname, user_lastname, user_contact, user_address) VALUES (?,?,?,?,?,?)',
                [email, password, name, lastname, contactNo, address],
                (tx, result) => {
                  console.log('Data inserted successfully');
                  this.setState({
                    id: '',
                    name: '',
                    email:'',
                    contactNo: '',
                    address: '',
                    password:'',
                    lastname:'',
                  });
                  Toast.show('Data inserted successfully');
                  this.props.navigation.goBack();
                },
                (error) => {
                  console.log('Error in inserting data:', error);
                  Alert.alert('Error', 'Failed to save data');
                }
              );
            });
          }
        },
        (error) => {
          console.log('Error in checking user_id:', error);
          Alert.alert('Error', 'Failed to check user_id');
        }
      );
    });
  };

  render() {
    const { id, name, lastname, email, password, contactNo, address } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
            <Text style={styles.headerText}>Add Employee Details</Text>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Email Address"
              onChangeText={(text) => this.handleInputemailaddress('email', text)}
              value={email}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your password"
              onChangeText={(text) => this.handleInputpassword('Password', text)}
              value={password}
              secureTextEntry={true}
              required
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter Your First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your First Name"
              onChangeText={(text) => this.handleInputChangeName('name', text)}
              value={name}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter Your Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Last Name"
              onChangeText={(text) => this.handleInputLastName('lastname', text)}
              value={lastname}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contact No</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Contact No"
              onChangeText={(text) =>
                this.handleChangeMobNum('contactNo', text)
              }
              value={contactNo}
              keyboardType="numeric"
            />
          </View>
        
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter Your Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Please Enter Your Address"
              onChangeText={(text) => this.address(text)}
              value={address}
            />
          </View>
          <View style={styles.ButtonContainer}>
            <TouchableOpacity style={styles.button} onPress={this.handleSave}>
              <Text style={{ color: '#fff', fontFamily: 'Roboto-Medium' }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
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
  inputContainer: {
    width: '100%',
    marginBottom: 25,
    // borderRadius: 10,
    // borderColor: '#0f76ae',
    // borderWidth: 0.1,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
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
  ButtonContainer: {
    height: 45,
    width: '60%',
    marginTop: 30,
    marginHorizontal: 60,
    borderColor: '#0f76ae',
    borderWidth: 2,
    bottom: 10,
    borderRadius: 25,
    backgroundColor: '#0f76ae',
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 25,
  },
});

export default InsertData;
