import React, { useState } from 'react';
import './App.css';
import { getFirestore, collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const app = initializeApp({
  apiKey: "AIzaSyDYsI30hlRL_3t1rNmdjJjx93DFgXRWhoE",
  authDomain: "twilight25chat.firebaseapp.com",
  databaseURL: "https://twilight25chat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "twilight25chat",
  storageBucket: "twilight25chat.appspot.com",
  messagingSenderId: "664950356028",
  appId: "1:664950356028:web:9c5531808c339700636b39",
  measurementId: "G-YERLZZRHSJ"
})

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const db = getFirestore(app);



function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <section>
          {user ? <ChatRoom /> : <SignIn />}
        </section>
      </header>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return (
    <button onClick={signInWithGoogle} className='sign-in-out'>Sign in with Google</button>
  )
}


function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()} className='sign-in-out'>Sign Out</button>
  )
}



function ChatRoom() {
  const messageRef = collection(db, "messages");

  const q = query(messageRef, orderBy('createdAt', 'desc'), limit(25));

  const [messages] = useCollectionData(q, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await addDoc(collection(db, 'messages'), {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
  }

  return (
    <div>
      <div className='button-header'>
        <span>Twilight</span>
        <SignOut />
      </div>
      <div className='main'>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type='submit'> Send </button>
      </form>
    </div>
  )
}



function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt="nice"/>
        <p>{text}</p>
      </div>
    </div>
  )
}



export default App;
