import { Button, Form, FormGroup } from "react-bootstrap";
import "./login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";
import { useDispatch, useSelector } from "react-redux";
import { toggleSignInUI } from "../../RTK/ResponseveUi";

const Login = () => {
  const dispatch = useDispatch();
  const openSignInPage = () => {
    dispatch(toggleSignInUI());
  };
  // @ts-ignore
  const signInIsOpen = useSelector((state) => state.responsiveUi.signInIsOpen);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);

  const handlAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handlLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    // @ts-ignore
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
      openSignInPage();
    }
  };

  const handlRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData(e.target);

    // @ts-ignore
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created! You can login now!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
      openSignInPage();
    }
  };

  return (
    <div className="login">
      {signInIsOpen ? (
        <div className="item">
          <h4>Welcom back,</h4>
          <Form onSubmit={handlLogin}>
            <FormGroup>
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control type="text" name="email" id="email"></Form.Control>
            </FormGroup>
            <FormGroup>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                id="password"
              ></Form.Control>
            </FormGroup>
            <Button disabled={loading} type="submit">
              {loading ? "Loading..." : "Sign in"}
            </Button>
            <p
              style={{ cursor: "pointer" }}
              onClick={() => {
                openSignInPage();
              }}
            >
              Craete An Account!
            </p>
          </Form>
        </div>
      ) : (
        <div className="item">
          <h4>Create An Account!</h4>
          <Form onSubmit={handlRegister}>
            <FormGroup>
              <div className="img">
                <img src={avatar.url || "./avatar.png"} alt="" />
              </div>
              <Form.Control id="file" type="file" onChange={handlAvatar} />
            </FormGroup>
            <FormGroup>
              <Form.Label htmlFor="username">User Name</Form.Label>
              <Form.Control
                type="text"
                name="username"
                id="username"
              ></Form.Control>
            </FormGroup>
            <FormGroup>
              <Form.Label htmlFor="email2">Email</Form.Label>
              <Form.Control
                type="text"
                name="email2"
                id="email2"
              ></Form.Control>
            </FormGroup>
            <FormGroup>
              <Form.Label htmlFor="password2">Password</Form.Label>
              <Form.Control
                type="password"
                name="password2"
                id="password2"
              ></Form.Control>
            </FormGroup>
            <Button disabled={loading} type="submit">
              {loading ? "Loading..." : "Sign Up"}
            </Button>
            <p
              style={{ cursor: "pointer" }}
              onClick={() => {
                openSignInPage();
              }}
            >
              Already Have An Account!
            </p>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Login;
