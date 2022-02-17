import { signOut } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { useAuthContext } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const Home = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };
  const { user } = useAuthContext();

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const usersCollectionRef = collection(db, "users");
    // getDocs(usersCollectionRef).then((querySnapshot) => {
    //   setUsers(querySnapshot.docs.map((doc) => doc.data()));
    // });
    const unsub = onSnapshot(usersCollectionRef, (querySnap) => {
      setUsers(querySnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsub;
  }, []);
  const dbTest = () => {
    const userDocumentRef = doc(db, "users", "ixLGqgOAG2yoUSgRFsWN");
    getDoc(userDocumentRef).then((docSnap) => {
      if (docSnap.exists()) {
        console.log("Doc:", docSnap.data());
      } else {
        console.log("No such documents");
      }
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email } = event.target.elements;
    console.log(name.value, email.value);
    // 登録処理
    const usersCollectionRef = collection(db, "users");
    const documentRef = await addDoc(usersCollectionRef, {
      name: name.value,
      email: email.value,
      timestamp: serverTimestamp(),
    });
    getDoc(documentRef).then((docSnap) =>
      console.log(documentRef.id, docSnap.data())
    );
  };

  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return (
      <div>
        <h1>ホームページ</h1>
        <div>
          <button onClick={handleLogout}>ログアウト</button>
        </div>
        <div>
          <button onClick={dbTest}>TEST</button>
          {users.map((user) => (
            <div key={user.id}>{user.name}</div>
          ))}
          <hr></hr>
          <form onSubmit={handleSubmit}>
            <div>
              <label>名前</label>
              <input type="text" name="name" placeholder="名前" />
            </div>
            <div>
              <label>メールアドレス</label>
              <input type="email" name="email" placeholder="メールアドレス" />
            </div>
            <div>
              <button>登録</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};
export default Home;
