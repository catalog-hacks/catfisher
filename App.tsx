/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { Provider, useEffect, useState } from 'react';
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
import '@ethersproject/shims';
import {JsonRpcProvider} from '@ethersproject/providers';

import * as Bip39 from 'bip39';
import { ethers,Wallet, providers } from 'ethers';
import { hdkey } from 'ethereumjs-wallet';
import {
  Colors,
  DebugInstructions,
  // Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import 'react-native-get-random-values';
import { HDNode } from 'ethers/lib/utils';
import { send } from 'process';

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
  let [init,setinit] = useState(false)
  let [provider,setprovider] = useState<JsonRpcProvider>();
  let [balance,setbalance] = useState('');
  let [wallet,setwallet] = useState<Wallet>();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(()=>{
    setprovider(new JsonRpcProvider('https://rpc.ankr.com/eth_goerli',5));
    // setprovider(new JsonRpcProvider('https://goerli.infura.io/v3/b863ead591d54e77be1db79ef34797a3',5));
    // console.log(provider)
  },[])
  
  const createWallet = async () => {
    // const mnemonic = Bip39.generateMnemonic();
    // const index = 0;
    // const seed = await Bip39.mnemonicToSeed(mnemonic);
    // const hdNode = hdkey.fromMasterSeed(seed);
    // const node = hdNode.derivePath(`m/44'/60'/0'`)
    // // m/44'/60'/0'/0
    // const change = node.deriveChild(0);
    // // m/44'/60'/0'/0/{N}
    // const childNode = change.deriveChild(index);
    // const childWallet = childNode.getWallet();
    // const wallet = new Wallet(childWallet.getPrivateKey().toString('hex'));

    const mnemonic = "verify screen farm resource present frozen repair neutral believe human balcony regret minimum legend letter"
    // const hdnode = HDNode.fromMnemonic(mnemonic)
    // const node = hdnode.derivePath(ethers.utils.defaultPath)
    const wallet = ethers.Wallet.fromMnemonic(mnemonic)
    const address = wallet.address.toString()
    // const mnemonic = wallet.mnemonic.phrase
    console.log(address.toString())
    console.log(mnemonic)
    setwallet(wallet)
    setaddress(address)
    setmnemonic(mnemonic)
    return address;
  }

  async function getBalance(add: string | Promise<string>) {
    console.log(add)
    // console.log(provider)
    let _balance = await provider!.getBalance(add);
    setbalance(ethers.utils.formatEther(_balance).toString())
  }
  
  async function sendTransaction(to, amount: string){
    const tx = {
      from: address,
      to: to,
      value: ethers.utils.parseEther(amount),
    }
    console.log(await provider?.getBlockNumber())
    const signed = await wallet!.signTransaction(tx);
    console.log ((await provider?.sendTransaction(signed!))?.hash.toString())
  }

  return (
    <>
    <View style={{flex:1, justifyContent: 'center',paddingBottom:'20%', alignItems: 'center'}} >
  <Button disabled={loading} title='Generate Wallet!' onPress={async () => {
    setloading(true);
    const address = createWallet()
    getBalance(address)
    setloading(false)
    setinit(true)
  }}/>
    <Text style={styles.sectionTitle}>{address}</Text>
    <Text>{mnemonic}</Text>
    <Text style={styles.sectionTitle}>{balance}</Text>
  </View>
    {init && <View style={{flex:2, justifyContent: 'center', alignItems: 'center'}}>
    <View style={{flexDirection:'row', paddingHorizontal:'30%',justifyContent: 'center', alignItems: 'center'}}>
      <Button title='send' onPress={async() => {
        sendTransaction(address,'0')
        getBalance(address) }}/>
      <Button title='receive'/>
    </View>
    <View>
    </View>
    </View>
    }
  </>
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
