
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Register from './Pages/Register';
// import HomePage from './Pages/HomePage';

 import Insert from './Pages/Insert';
import Delete from './Pages/Delete';
import Update from './Pages/Update';
import ViewPage from './Pages/ViewPage';



const Stack = createNativeStackNavigator();
const db = SQLite.openDatabase({ name: 'mydb.db', location: 'default' });

const SplashScreen = () => {
  // return (
  //   <View style={styles.splashContainer}>
  //     <Image style={styles.splashLogo} source={require('./component/assets/splash_image.jpeg')} resizeMode='contain' />
  //     {/* <ActivityIndicator size="large" color="#7b68ee" /> */}
  //   </View>
  // );
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }


  componentDidMount = async () =>{


    const data = await AsyncStorage.getItem('TableCreate');

    if (data !== '1') {
      this.database();
    }



  }

  componentWillUnmount = () =>{

  }


  
  database = async () => {
    // db.transaction((tx) => {
    //   tx.executeSql(
    //     'CREATE TABLE IF NOT EXISTS MyTable(id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_age INT(5), user_contact INT(10), user_address VARCHAR(255), user_login VARCHAR(255), user_logout VARCHAR(255))',
    //     [],
    //     (tx, result) => {
    //       console.log('Table created successfully');
    //       Alert.alert('Table created successfully');
    //     },
    //     (error) => {
    //       console.log('Error in table creation:', error);
    //     }
    //   );
    // });




    db.transaction((tx) => {
      tx.executeSql(
        // 'CREATE TABLE IF NOT EXISTS MyTable(id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_email VARCHAR(20),  user_contact INT(10), user_address VARCHAR(255), user_login VARCHAR(255), user_logout VARCHAR(255))',

        'CREATE TABLE IF NOT EXISTS MyTable(id INTEGER PRIMARY KEY AUTOINCREMENT, user_email VARCHAR(20), user_password VARCHAR(20),user_firstname VARCHAR(20), user_lastname VARCHAR(20), user_contact INT(10), user_address VARCHAR(255))', 
        [],
        (tx, result) => {
          console.log('Table created successfully');
          // Alert.alert('Table created successfully');
        },
        (error) => {
          console.log('Error in table creation:', error);
        }
      );
    });

    await AsyncStorage.setItem('TableCreate', '1');
  };





  // handleLogin = async () => {
  //   const { username, password } = this.state;
  //   const { navigation } = this.props;

  //   // Add your login logic here
  //   if (username && password) {
  //     // Example: Check credentials (to be replaced with actual logic)
  //     // Assuming successful login if username and password are not empty

  //     // Store the sign-in status
  //     await AsyncStorage.setItem('isSignedIn', 'true');
  //     navigation.navigate('ViewPage');
  //   } else {
  //     alert('Please enter both username and password');
  //   }
  // };


  handleLogin = async () => {
    const { email, password } = this.state;
    const { navigation } = this.props;

    // Query the database
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM MyTable WHERE user_email = ? AND user_password = ?',
        [email, password],
        (tx, results) => {
          if (results.rows.length > 0) {
            // Login successful
            // Alert.alert('Login Successful', 'Welcome to the home page');
            Toast.show('Login Successfull');
            
            navigation.navigate('ViewPage');
      
            // Navigate to home page or perform other actions
          } else {
            // Login failed
            Alert.alert('Login Failed', 'Incorrect email or password');
          }

          console.log('Email', email );

          this.setState({
            email:'',
            password:'',
          
          });
         
        },
        (error) => {
          console.error('Error querying database: ', error);
          Alert.alert('Error', 'Login failed. Please try again later.');
        }
      );
    });
  };









  render() {
    const { email, password } = this.state;
    const { navigation } = this.props;

    return (
      <ScrollView style={styles.container}>

  
         <View style={styles.header}>
              <Text style={styles.headerTitle}>Login</Text>
            </View>
            <View style={{marginVertical:20,}}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputbox}>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Email Address"
            placeholderTextColor="#B5AAAD"
            onChangeText={(text) => this.setState({ email: text })}
            value={email}
            required
          />
        </View>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputbox}>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Password"
            placeholderTextColor="#B5AAAD"
            onChangeText={(text) => this.setState({ password: text })}
            value={password}
            secureTextEntry={true}
            required
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={this.handleLogin}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
        <Text style={styles.bottomlabel}> Oh ! Not Register yet?</Text>
        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
        {/* <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Insert")}> */}
        
          <Text style={styles.registerButtonText}>Register Now</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAppReady: false,
      isSignedIn: null
    };
  }

  async componentDidMount() {
    const prepareApp = async () => {
      // Simulating some loading time
      setTimeout(async () => {
        const signInStatus = await AsyncStorage.getItem('isSignedIn');
        this.setState({ isSignedIn: signInStatus === 'true', isAppReady: true });
      }, 2000);
    };

    await prepareApp();
  }

  render() {
    const { isAppReady, isSignedIn } = this.state;

    if (!isAppReady) {
      return <SplashScreen />;
    }

    return (
      <NavigationContainer>
        <StatusBar backgroundColor={"#B5AAAD"} />
        <Stack.Navigator initialRouteName={isSignedIn ? "Home1" : "Login"}>
          <Stack.Screen name="Login" component={Login} options={{ header: () => null }} />
          <Stack.Screen name="Register" component={Register} options={{ header: () => null }} />
          {/* <Stack.Screen name="HomePage" component={HomePage} options={{ header: () => null }} /> */}
          <Stack.Screen name="Insert" component={Insert} options={{ header: () => null }} />
          <Stack.Screen name="Delete" component={Delete} options={{ header: () => null }} />
          <Stack.Screen name="Update" component={Update} options={{ header: () => null }} />
          <Stack.Screen name="ViewPage" component={ViewPage} options={{ header: () => null }} />


          
 
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: 'white',
    flex: 1,
    backgroundColor: '#F5F5F5',
    // padding: 10,
  },
  containerHead: {
    marginTop: 30,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginVertical: 10,
    height: 90,
    marginBottom: 10,
  },
  label: {
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 10,
    color: 'black',
    fontWeight: '600',
  },
  inputbox: {
    borderBottomColor: '#B5AAAD',
    borderBottomWidth: 1,
    marginBottom: 20,
    marginHorizontal: 10,
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    width: '85%',
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    color: 'black',
  },
  loginButton: {
    // backgroundColor: '#7b68ee',
    backgroundColor: '#0f76ae',
    padding: 10,
    borderRadius: 5,
    width: '95%',
    height: 50,
    marginHorizontal: 10,
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    paddingTop: 5,
    fontWeight: 'bold',
  },
  bottomlabel: {
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 10,
    color: 'black',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  registerButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    width: '95%',
    marginHorizontal: 10,
    // borderColor: '#7b68ee',
    borderColor: '#0f76ae',
    // backgroundColor: '#0f76ae',
    borderWidth: 1,
    marginVertical: 20,
    height: 50,
  },
  registerButtonText: {
    // color: '#7b68ee',
    color:'#0f76ae',
    textAlign: 'center',
    fontWeight: 'bold',
    paddingTop: 5,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },



  header: {
        // backgroundColor: '#7b68ee',
        backgroundColor: '#0f76ae',
        padding: 15,
      },
      headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        // textAlign: 'center',
      },



      




});

export default App;
