import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";

const TodoList = () => {
  const [task, setaddusertask] = useState(""); //newly add data
  const [errorText, seterrorMessage] = useState(""); //to display the error message
  const [filter, setFilter] = useState(""); //filter the values completed or not
  const [nextId, setNextId] = useState(1); //getting the id

  const [userData, setUserData] = useState([]); //storing the jsondata
  useEffect(() => {
    fetchuserData();
  }, []);
  const fetchuserData = async () => {
    await axios
      .get("https://jsonplaceholder.typicode.com/users/1/todos")
      .then((response) => {
        if (response?.status === 200) {
          setUserData(response.data);
          console.log(response.data);

          const maxId = response.data.reduce((max, task) => {
            return task.id > max ? task.id : max;
          }, 0);

          setNextId(maxId + 1);

          seterrorMessage("");
        } else {
          setUserData([]);
        }
      })
      .catch((error) => {
        seterrorMessage(error.message);
        setUserData([]);
      });
  };
  const SubmitHandle = (event) => {
    event.preventDefault();
    if (task.trim() === "") {
      alert("Please enter the task");

      return;
    }
    const newRecord = {
      userId: 1,
      id: nextId,
      title: task,
      completed: false,
    };

    setUserData([...userData, newRecord]);
    setNextId(nextId + 1);
    setaddusertask(" ");
  };

  const toggleTaskCompletion = (id) => {
    const updatedTodos = userData.map((eachtodo) =>
      eachtodo.id === id
        ? { ...eachtodo, completed: !eachtodo.completed }
        : eachtodo
    );
    setUserData(updatedTodos);
  };
  const editpost = (id, newtitle) => {
    const updatetask = userData.map((eachtodo) =>
      eachtodo.id === id ? { ...eachtodo, title: newtitle } : eachtodo
    );
    setUserData(updatetask);
  };

  const deletePost = (id) => {
    // alert(id);
    const updatetask = userData.filter((eachtodo) => eachtodo.id !== id);
    setUserData(updatetask);
  };

  return (
    <div class="form-cont">
      <h1>Todo App</h1>
      <br />
      <form>
        <input
          type="text"
          placeholder="Enter the task"
          value={task}
          onChange={(event) => setaddusertask(event.target.value)}
        />
        <Button type="submit" onClick={SubmitHandle}>
          Add Task
        </Button>
      </form>
      <br />
      <br />
      <div>
        <Button variant="info" onClick={() => setFilter("all")}>
          All
        </Button>
        <Button variant="secondary" onClick={() => setFilter("completed")}>
          Completed
        </Button>
      </div>
      <br />
      <br />
      <Table striped border variant="dark">
        <thead>
          <tr>
            <td>Userid</td>
            <td>id</td>
            <td>task</td>
            <td>status</td>
            <td>EditButton</td>
            <td>DeleteButton</td>
          </tr>
        </thead>
        <tbody>
          {userData.length > 0 ? (
            userData
              .filter((eachobject) =>
                filter === "completed" ? eachobject.completed : true
              )
              .map((eachobject) => (
                <tr key={eachobject.id}>
                  <td>{eachobject.userId}</td>
                  <td>{eachobject.id}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={eachobject.completed}
                      onChange={() => toggleTaskCompletion(eachobject.id)}
                    />
                    <span
                      style={{
                        textDecoration: eachobject.completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {eachobject.title}
                    </span>
                  </td>
                  <td>{eachobject.completed ? "true" : "false"}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => {
                        editpost(
                          eachobject.id,
                          prompt("Edit Title", eachobject.title)
                        );
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => {
                        deletePost(eachobject.id);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
          ) : (
            <tr colspan={4}>
              <td>No data Available{errorText && <h1>{errorText}</h1>}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TodoList;
