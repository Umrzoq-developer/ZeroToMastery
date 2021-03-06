import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {createStructuredSelector} from "reselect";

import './App.css';

// There I recieved Pages
import Homepage from "./pages/homepage/homepage";
import Shop from "./pages/shop/shop";
import Header from "./components/header/header";
import SignInAndSignUp from "./pages/sign-in-and-sign-up/sign-in-and-sign-up";
import CheckoutPage from "./pages/checkout/checkout";

import {auth, createUserProfileDocument} from "./firebase/firebase.utils";

import {setCurrentUser} from "./redux/user/user.actions";
import {selectCurrentUser} from "./redux/user/user.selector";

class App extends Component {

    unsubscribeFromAuth = null;

    componentDidMount() {
        const {setCurrentUser} = this.props;

        this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
            if (userAuth) {
                const userRef = await createUserProfileDocument(userAuth);

                userRef.onSnapshot(snapShot => {
                    setCurrentUser({
                        id: snapShot.id,
                        ...snapShot.data()
                    })
                });
            }
            setCurrentUser(userAuth)
        })
    }

    componentWillUnmount() {
        this.unsubscribeFromAuth();
    }

    render() {
        return (
            <div>

                <Header/>
                <Switch>
                    <Route exact path="/" component={Homepage}/>
                    <Route path="/shop" component={Shop}/>
                    <Route exact path="/checkout" component={CheckoutPage}/>
                    <Route
                        exact
                        path="/signin"
                        render={() => this.props.currentUser ? (
                            <Redirect to='/' />
                        ) : (
                            <SignInAndSignUp/>
                        )
                        }
                    />
                </Switch>
            </div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
