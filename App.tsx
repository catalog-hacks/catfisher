/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  ActivityIndicator,
  ActivityIndicatorComponent,
  Button,
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import './shim'

import * as Bip39 from 'bip39';
import { Wallet } from 'ethers';
import { hdkey } from 'ethereumjs-wallet';
import {
  Colors,
  DebugInstructions,
  // Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import 'react-native-get-random-values';
import { SocketAddress } from 'net';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.light : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}



  


function App(): JSX.Element {
  const isDarkMode = true;

  const [address,setaddress] = useState('')
  let [loading,setloading] = useState(false)
  let [mnemonic,setmnemonic] = useState('')
  

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const generateMnemonic = () => {
    const mnemonic = Bip39.generateMnemonic();
    return mnemonic;
  }

  const createWallet = async () => {
    const mnemonic = generateMnemonic();
    const index = 0;
    const seed = await Bip39.mnemonicToSeed(mnemonic);
    const hdNode = hdkey.fromMasterSeed(seed);
    const node = hdNode.derivePath(`m/44'/60'/0'`)
    // m/44'/60'/0'/0
    const change = node.deriveChild(0);
    // m/44'/60'/0'/0/{N}
    const childNode = change.deriveChild(index);
    const childWallet = childNode.getWallet();
    const wallet = new Wallet(childWallet.getPrivateKey().toString('hex'));
    console.log(wallet.address.toString())
    setaddress(wallet.address)
    setmnemonic(mnemonic)
  }



  return (
    
    <View style={{flex:3, justifyContent: 'center', alignItems: 'center'}} >
  <Button disabled={loading} title='Generate Wallet!' onPress={async () => {
    setloading(true);
    createWallet()
    setloading(false)
  }}/>

    <Text>{address}</Text>
    <Text>{mnemonic}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
