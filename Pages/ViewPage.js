


import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { BackHandler } from 'react-native';
import ImagePicker from 'react-native-image-picker';

const db = SQLite.openDatabase({ name: 'mydb.db', location: 'default' });

class DetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.backButtonClick = this.backButtonClick.bind(this);


    this.handleLogout = this.handleLogout.bind(this);
    this.Logout = this.Logout.bind(this);
    this.state = {
      data: [],
      expandedItem: null,
    };
  }

  backButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  componentDidMount = () => {
    this.loadData();
    BackHandler.addEventListener('hardwareBackPress', this.backButtonClick);
    this.focusListener = this.props.navigation.addListener('focus', this.loadData);
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backButtonClick);
    if (this.focusListener) {
      this.focusListener();
    }
  }

  backButtonClick() {
    Alert.alert(
      'Exit App',
      'Do you want to exit?',
      [
        { text: 'Yes', onPress: () => BackHandler.exitApp() },
        { text: 'No', onPress: () => console.log('NO Pressed') },
      ],
      { cancelable: false }
    );

    // Return true to enable back button override.
    return true;
  }

  loadData = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM MyTable', [], (tx, results) => {
        const temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({ data: temp });
      });
    });
  };

  handleEdit = (id) => {
    this.props.navigation.navigate('Update', { itemId: id });
  };

  handleDelete = (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this record?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => this.confirmDelete(id),
        },
      ],
      { cancelable: false }
    );
  };

  confirmDelete = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM MyTable WHERE id = ?',
        [id],
        (tx, result) => {
          console.log('Record deleted successfully');
          this.loadData(); // Refresh data after deletion
        },
        (error) => {
          console.log('Error in deleting record:', error);
          Alert.alert('Error', 'Failed to delete record');
        }
      );
    });
  };

  toggleItem = (id) => {
    this.setState((prevState) => ({
      expandedItem: prevState.expandedItem === id ? null : id,
    }));
  };


  handleLogout() {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to Logout?',
      [
        { text: 'Yes', onPress: () => this.Logout()},
        { text: 'No', onPress: () => console.log('NO Pressed') },
      ],
      { cancelable: false }
    );

    // Return true to enable back button override.
    return true;
  }





Logout = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM MyTable',
        [],
        (tx, result) => {
          console.log('All records deleted successfully');
          this.loadData(); // Refresh data after deletion
          // Alert.alert('Logged out', 'You have been logged out');

          this.props.navigation.navigate('Login'); // Redirect to Login screen or any other screen
        },
        (error) => {
          console.log('Error in deleting all records:', error);
          Alert.alert('Error', 'Failed to delete all records');
        }
      );
    });
  };

  renderDetailsItem = ({ item }) => {
    const isExpanded = this.state.expandedItem === item.id;

    return (
      <TouchableOpacity onPress={() => this.toggleItem(item.id)}>
        <View style={styles.itemContainer}>
          <Text style={[styles.itemText, { fontWeight: 'bold', color: '#2196F3' }]}>
            First Name: {item.user_firstname}
          </Text>
          <Text style={styles.itemText}>Last Name: {item.user_lastname}</Text>
          {isExpanded && (
            <>
              <Text style={styles.itemText}>Email: {item.user_email}</Text>
              <Text style={styles.itemText}>Contact No: {item.user_contact}</Text>
              <Text style={styles.itemText}>Address: {item.user_address}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => this.handleDelete(item.id)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton} onPress={() => this.handleEdit(item.id)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerText}>Profile List</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={this.handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <FlatList
            data={this.state.data}
            renderItem={this.renderDetailsItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => this.props.navigation.navigate('Insert')}>
          <Text style={styles.addButtonText}>Add Profile</Text>
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  itemContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 8,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: '#0f76ae',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    left:20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    
  },
  logoutButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DetailsScreen;











///pic Add 
// import React, { Component } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   Image,
// } from 'react-native';
// import SQLite from 'react-native-sqlite-storage';
// import { BackHandler } from 'react-native';
// import ImagePicker from 'react-native-image-picker';

// const db = SQLite.openDatabase({ name: 'mydb.db', location: 'default' });

// class DetailsScreen extends Component {
//   constructor(props) {
//     super(props);
//     this.backButtonClick = this.backButtonClick.bind(this);
//     this.handleLogout = this.handleLogout.bind(this);
//     this.Logout = this.Logout.bind(this);
//     this.state = {
//       data: [],
//       expandedItem: null,
//       profilePicture: null,
//     };
//   }

//   backButtonClick() {
//     this.props.navigation.goBack(null);
//     return true;
//   }

//   componentDidMount = () => {
//     this.loadData();
//     BackHandler.addEventListener('hardwareBackPress', this.backButtonClick);
//     this.focusListener = this.props.navigation.addListener('focus', this.loadData);
//   }

//   componentWillUnmount = () => {
//     BackHandler.removeEventListener('hardwareBackPress', this.backButtonClick);
//     if (this.focusListener) {
//       this.focusListener();
//     }
//   }

//   backButtonClick() {
//     Alert.alert(
//       'Exit App',
//       'Do you want to exit?',
//       [
//         { text: 'Yes', onPress: () => BackHandler.exitApp() },
//         { text: 'No', onPress: () => console.log('NO Pressed') },
//       ],
//       { cancelable: false }
//     );

//     // Return true to enable back button override.
//     return true;
//   }

//   loadData = () => {
//     db.transaction((tx) => {
//       tx.executeSql('SELECT * FROM MyTable', [], (tx, results) => {
//         const temp = [];
//         for (let i = 0; i < results.rows.length; ++i) {
//           temp.push(results.rows.item(i));
//         }
//         this.setState({ data: temp });
//       });
//     });
//   };

//   handleEdit = (id) => {
//     this.props.navigation.navigate('Update', { itemId: id });
//   };

//   handleDelete = (id) => {
//     Alert.alert(
//       'Confirm Deletion',
//       'Are you sure you want to delete this record?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Delete',
//           onPress: () => this.confirmDelete(id),
//         },
//       ],
//       { cancelable: false }
//     );
//   };

//   confirmDelete = (id) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'DELETE FROM MyTable WHERE id = ?',
//         [id],
//         (tx, result) => {
//           console.log('Record deleted successfully');
//           this.loadData(); // Refresh data after deletion
//         },
//         (error) => {
//           console.log('Error in deleting record:', error);
//           Alert.alert('Error', 'Failed to delete record');
//         }
//       );
//     });
//   };

//   toggleItem = (id) => {
//     this.setState((prevState) => ({
//       expandedItem: prevState.expandedItem === id ? null : id,
//     }));
//   };

//   handleLogout() {
//     Alert.alert(
//       'Confirm Logout',
//       'Are you sure you want to Logout?',
//       [
//         { text: 'Yes', onPress: () => this.Logout()},
//         { text: 'No', onPress: () => console.log('NO Pressed') },
//       ],
//       { cancelable: false }
//     );

//     // Return true to enable back button override.
//     return true;
//   }

//   Logout = () => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'DELETE FROM MyTable',
//         [],
//         (tx, result) => {
//           console.log('All records deleted successfully');
//           this.loadData(); // Refresh data after deletion
//           this.props.navigation.navigate('Login'); // Redirect to Login screen or any other screen
//         },
//         (error) => {
//           console.log('Error in deleting all records:', error);
//           Alert.alert('Error', 'Failed to delete all records');
//         }
//       );
//     });
//   };

//   selectProfilePicture = () => {
//     const options = {
//       title: 'Select Profile Picture',
//       storageOptions: {
//         skipBackup: true,
//         path: 'images',
//       },
//     };

//     ImagePicker.showImagePicker(options, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//       } else if (response.customButton) {
//         console.log('User tapped custom button: ', response.customButton);
//       } else {
//         const source = { uri: response.uri };
//         this.setState({
//           profilePicture: source,
//         });
//       }
//     });
//   };

//   renderDetailsItem = ({ item }) => {
//     const isExpanded = this.state.expandedItem === item.id;

//     return (
//       <TouchableOpacity onPress={() => this.toggleItem(item.id)}>
//         <View style={styles.itemContainer}>
//           <View style={styles.itemHeader}>
//             <View style={styles.textContainer}>
//               <Text style={[styles.itemText, { fontWeight: 'bold', color: '#2196F3' }]}>
//                 First Name: {item.user_firstname}
//               </Text>
//               <Text style={styles.itemText}>Last Name: {item.user_lastname}</Text>
//             </View>
//             <TouchableOpacity onPress={this.selectProfilePicture}>
//               <Image
//                 source={this.state.profilePicture || require('./path/to/default/image.png')}
//                 style={styles.profileImage}
//               />
//             </TouchableOpacity>
//           </View>
//           {isExpanded && (
//             <>
//               <Text style={styles.itemText}>Email: {item.user_email}</Text>
//               <Text style={styles.itemText}>Contact No: {item.user_contact}</Text>
//               <Text style={styles.itemText}>Address: {item.user_address}</Text>
//               <View style={styles.buttonContainer}>
//                 <TouchableOpacity style={styles.deleteButton} onPress={() => this.handleDelete(item.id)}>
//                   <Text style={styles.buttonText}>Delete</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.editButton} onPress={() => this.handleEdit(item.id)}>
//                   <Text style={styles.buttonText}>Edit</Text>
//                 </TouchableOpacity>
//               </View>
//             </>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   render() {
//     return (
//       <>
//         <View style={styles.header}>
//           <View style={styles.titleContainer}>
//             <Text style={styles.headerText}>Profile List</Text>
//           </View>
//           <TouchableOpacity style={styles.logoutButton} onPress={this.handleLogout}>
//             <Text style={styles.logoutButtonText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.container}>
//           <FlatList
//             data={this.state.data}
//             renderItem={this.renderDetailsItem}
//             keyExtractor={(item) => item.id.toString()}
//             contentContainerStyle={styles.flatListContent}
//           />
//         </View>
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={() => this.props.navigation.navigate('Insert')}>
//           <Text style={styles.addButtonText}>Add Profile</Text>
//         </TouchableOpacity>
//       </>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//     paddingHorizontal: 16,
//     paddingTop: 20,
//   },
//   itemContainer: {
//     backgroundColor: '#FFF',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//     elevation: 2,
//   },
//   itemText: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   flatListContent: {
//     paddingBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   deleteButton: {
//     backgroundColor: '#FF6347',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 4,
//   },
//   editButton: {
//     backgroundColor: '#2196F3',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 4,
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//     height: 50,
//     backgroundColor: '#0f76ae',
//   },
//   titleContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     left:20,
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFF',
    
//   },
//   logoutButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//   },
//   logoutButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//   },
//   addButton: {
//     backgroundColor: '#2196F3',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//   },
//   addButtonText: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   itemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   textContainer: {
//     flex: 1,
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
// });

// export default DetailsScreen;



