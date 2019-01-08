import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders.js';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  meat: 0.4,
  cheese: 1.3,
  bacon: 0.7
}
class BurgerBuilder extends Component {

    state = {
        ingredients: {
            salad: 0,
            meat: 0,
            cheese: 0,
            bacon: 0
        },
        price: 4,
        purchasable: false,
        purchasing: false,
        loading: false
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount;
        const oldPrice = this.state.price;
        const updatedPrice = oldPrice + INGREDIENT_PRICES[type];

        this.setState({
          ingredients: updatedIngredients,
          price: updatedPrice
        });
        this.updatePurchaseState(updatedIngredients);
    };

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount;
        const oldPrice = this.state.price;
        const updatedPrice = oldPrice - INGREDIENT_PRICES[type];

        this.setState({
          ingredients: updatedIngredients,
          price: updatedPrice
        });
        this.updatePurchaseState(updatedIngredients);
    };

    updatePurchaseState (updatedIngredients) {
      // const ingredients = {...this.state.ingredients};
      const sum = Object.keys(updatedIngredients)
              .map(igKey => {
                  return updatedIngredients[igKey];
              })
              .reduce((sum, el) => {
                  return sum + el;
              }, 0);
      this.setState({purchasable: sum > 0});
    }

    purchaseHandler = () => {
      this.setState({purchasing: true})
    }

    purchaseCancelHandler = () => {
      this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
      // alert('You continue!');
      this.setState({loading: true});

      const order = {
          ingredients: this.state.ingredients,
          price: this.state.price,
          customer: {
              name: 'Pritam Das',
              address: {
                  street: 'W S E',
                  zipcode: 'M1',
                  country: 'Panama'
              },
              email: 'pdpdpd@gmail'
          },
          deliveryMethod: 'fastest'
      };

      axios.post('/orders.json', order)
          .then(response => {
              this.setState({loading: false, purchasing: false})
          }).catch(error => {
              this.setState({loading: false, purchasing: false})
          })
    }

    render () {

      const disabledInfo = {...this.state.ingredients};

      for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
      }

      let orderSummary = <OrderSummary ingredients={this.state.ingredients}
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    price={this.state.price}/>;
      if (this.state.loading) {
          orderSummary = <Spinner />
      }
      return (
        <Aux>
          <Modal show={this.state.purchasing}
                 modalClosed={this.purchaseCancelHandler}>
                 {orderSummary}
          </Modal>
          <Burger ingredients={this.state.ingredients}/>
          <BuildControls
              ingredientAdded={this.addIngredientHandler}
              ingredientRemoved={this.removeIngredientHandler}
              disabled={disabledInfo}
              purchasable={this.state.purchasable}
              price={this.state.price}
              ordered={this.purchaseHandler}/>
        </Aux>
      )
    }
};

export default withErrorHandler(BurgerBuilder, axios);
