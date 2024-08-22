import { LightningElement } from 'lwc';

export default class ToDoApplication extends LightningElement {
    taskname = "";
    taskdate = null;
    incompletetask = [];
    completetask = [];
    inprogresstask = [];
  
    changeHandler(event) {
        let name = event.target.name;
        let value = event.target.value;
        if (name === "taskname") {
            this.taskname = value;
        } else if (name === "taskdate") {
            this.taskdate = value;
        }
    }
    resetHandler(){
       this.taskname = "";   
       this.taskdate = null;
    }
    addTaskHandler(){
        if(!this.taskdate){
        this.taskdate= new Date().toISOString().slice(0, 10);
        }
        const isTaskValid = this.validateTask();
        if(isTaskValid){
            this.incompletetask =[
            ...this.incompletetask,
            {
              taskname: this.taskname,
              taskdate: this.taskdate
            }
        ];

        
              this.resetHandler();
              let sortedArray = this.sortTask(this.incompletetask);
              this.incompletetask =[...sortedArray];
        }
        
    }
    validateTask(){
        
      let isValid =true;
      let element =this.template.querySelector(".taskname");
      if(!this.taskname){
        isValid=false;
      }else{
        let taskItem = this.incompletetask.find(
        (currItem) =>
         currItem.taskname === this.taskname && 
         currItem.taskdate === this.taskdate 
    );   
         
     if(taskItem){
        isValid = false;
        element.setCustomValidity("Task is Already Available");
      }
   }
   if(isValid){
    element.setCustomValidity("");
   }
    element.reportValidity();
    return isValid;
    }
    sortTask(inputArr){
        let sortedArray =inputArr.sort((a, b) => {
            const dateA = new Date(a.taskdate);
            const dateB = new Date(b.taskdate);
            return dateA - dateB;
        });
         return sortedArray;
    }
    removalHandler(event){
     let index = event.target.name;
     this.incompletetask.splice(index, 1);
     let sortedArray = this.sortTask(this.incompletetask);
     this.incompletetask =[...sortedArray];
     console.log("this.incompletetask",this.incompletetask);
        
    }
    completetaskHandler(event){
       let index = event.target.name;
      // let removeItem = this.incompletetask.splice(index, 1);
     //  let sortedArray = this.sortTask(this.incompletetask);
     //  this.incompletetask =[...sortedArray];
     //  console.log("this.incompletetask",this.incompletetask);
     //  this.completetask = [...this.completetask, removeItem[0]];
       this.refreshData(index);
        
    }
    startTaskHandler(event) {
        let index = event.target.name;
        let taskToMove = this.incompletetask.splice(index, 1)[0];  // Remove the task from incompletetask
        this.inprogresstask = [...this.inprogresstask, taskToMove]; // Add the task to inprogresstask
        this.incompletetask = [...this.incompletetask];            // Update the To Do List
    }
    completeTaskFromInProgressHandler(event) {
        let index = event.target.name;
         console.log(taskToMove);
        // Remove the task from the In Progress list
        let taskToMove = this.inprogresstask.splice(index, 1)[0];
    
        // Add the task to the Completed list
        this.completetask = [...this.completetask, taskToMove];
    
        // Update the In Progress list
        this.inprogresstask = [...this.inprogresstask];
    }
    reopenTaskHandler(event) {
    let index = event.target.name;

    // Remove the task from the Completed list
    let taskToReopen = this.completetask.splice(index, 1)[0];

    // Add the task back to the In Progress list
    this.inprogresstask = [...this.inprogresstask, taskToReopen];

    // Update the Completed list
    this.completetask = [...this.completetask];
}

    dragStartHandler(event){
        event.dataTransfer.setData("index", event.target.dataset.item);
    }
    allowDrop(event){
        event.preventDefault();
    }
    dropElementHandler(event){
         let index = event.dataTransfer.getData("index");
         this.inprogresstask = [...this.inprogresstask];
         this.refreshData(index);
    }
    refreshData(index){
        let removeItem = this.incompletetask.splice(index, 1);
        let sortedArray = this.sortTask(this.incompletetask);
        this.incompletetask =[...sortedArray];
        console.log("this.incompletetask",this.incompletetask);
        this.completetask = [...this.completetask, removeItem[0]];

    }
    
}

