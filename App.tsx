import React, { useState } from "react";
import { View, Switch, StyleSheet } from "react-native";
import TcpSocket from 'react-native-tcp-socket';

const App = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    if (isEnabled){
      createServer()
    } else {
      createClient()
    }
  }

  const connectionOptions = {
    port: 58888,
    host: '10.0.0.111',
    tls: true,
  }

  const createClient = () => {
    const client = TcpSocket.createConnection(connectionOptions, () => {
      // Write on the socket
      client.write('Hello server!');
    
      // Close socket
      client.destroy();
    });
    
    client.on('data', function(data) {
      console.log('message was received', data);
    });
    
    client.on('error', function(error) {
      console.log(error);
    });
    
    client.on('close', function(){
      console.log('Connection closed!');
    });  
  }

  const createServer = () => {
    const server = TcpSocket.createServer(function(socket) {
      socket.on('data', (data) => {
        socket.write('Echo server ' + data);
      });
    
      socket.on('error', (error) => {
        console.log('An error ocurred with client socket ', error);
      });
    
      socket.on('close', (error) => {
        console.log('Closed connection with ', socket.address());
      });
    }).listen(connectionOptions);
    
    server.on('error', (error) => {
      console.log('An error ocurred with the server', error);
    });
    
    server.on('close', () => {
      console.log('Server closed connection');
    });    
  }

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default App;
