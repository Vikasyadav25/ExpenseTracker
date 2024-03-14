import { useState, useReducer } from "react";
import "./App.css";
import { db } from "./firebaseInt";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { useEffect } from "react";

// components imports
import ExpenseForm from "./components/ExpenseForm/ExpenseForm";
import ExpenseInfo from "./components/ExpenseInfo/ExpenseInfo";
import ExpenseList from "./components/ExpenseList/ExpenseList";

// react toasts
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import firebase methods here

const reducer = (state, action) => {
  const { payload } = action;
  switch (action.type) {
    case "ADD_EXPENSE": {
      return {
        expenses: [payload.expense, ...state.expenses],
      };
    }
    case "REMOVE_EXPENSE": {
      return {
        expenses: state.expenses.filter((expense) => expense.id !== payload.id),
      };
    }
    case "SET_EXPENSES": {
      return {
        expenses: payload.expenses,
      };
    }
    case "UPDATE_EXPENSE": {
      const updatedExpenses = state.expenses.map((exp) => {
        if (exp.id === payload.expense.id) {
          return payload.expense;
        }
        return exp;
      });
      return {
        expenses: updatedExpenses,
      };
    }
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, { expenses: [] });
  const [expenseToUpdate, setExpenseToUpdate] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expensesCollection = collection(db, "expenses");
        const snapshot = await getDocs(expensesCollection);
        const expenses = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(expenses);
        console.log(state.expenses);
        
        dispatch({ type: "SET_EXPENSES", payload: { expenses } });
      } catch (error) {
        console.error("Error fetching expenses: ", error);
      }
    };
    fetchExpenses();
  }, []);

  const addExpense = async (expense) => {
    try {
      const docRef = await addDoc(collection(db, "expenses"), expense);
      dispatch({
        type: "ADD_EXPENSE",
        payload: { expense: { ...expense, id: docRef.id } },
      });
      toast.success("Expense added successfully.");
    } catch (error) {
      console.error("Error adding expense: ", error);
      toast.error("Failed to add expense.");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
      dispatch({ type: "REMOVE_EXPENSE", payload: { id } });
      toast.success("Expense deleted successfully.");
    } catch (error) {
      console.error("Error deleting expense: ", error);
      toast.error("Failed to delete expense.");
    }
  };

  const resetExpenseToUpdate = () => {
    setExpenseToUpdate(null);
  };

  const updateExpense = async (expense) => {
    try {
      const docRef = doc(db, "expenses", expense.id);
      await setDoc(docRef, expense);
      dispatch({ type: "UPDATE_EXPENSE", payload: { expense } });
      toast.success("Expense updated successfully.");
    } catch (error) {
      console.error("Error updating expense: ", error);
      toast.error("Failed to update expense.");
    }
  };

  return (
    <>
      <ToastContainer />
      <h2 className="mainHeading">Expense Tracker</h2>
      <div className="App">
        <ExpenseForm
          addExpense={addExpense}
          expenseToUpdate={expenseToUpdate}
          updateExpense={updateExpense}
          resetExpenseToUpdate={resetExpenseToUpdate}
        />
        <div className="expenseContainer">
          <ExpenseInfo expenses={state.expenses} />
          <ExpenseList
            expenses={state.expenses}
            deleteExpense={deleteExpense}
            changeExpenseToUpdate={setExpenseToUpdate}
          />
        </div>
      </div>
    </>
  );
}

export default App;
