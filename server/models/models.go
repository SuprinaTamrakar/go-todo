package models

import "go.mongodb.org/mongo-driver/bson/primitive"

//A ToDoList struct with three fields, which can be used to represent a MongoDB document with an _id, a task description, and a completion status.
type ToDoList struct {
	ID     primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Task   string             `json:"task,omitempty"`
	Status bool               `json:"status,omitempty"`
}
