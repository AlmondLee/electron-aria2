import { connect } from "react-redux"
import { Dispatch } from "redux"

import NewTaskDialog, { DispatchProps, StoreProps } from "../views/newTaskDialog"
import { receivedTasks, RootAction } from "../actions"
import { RootState } from "../reducer"

function mapStateToProps(state: RootState): StoreProps {
    return {
    }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
    return {
        addTask: (rpc, uri) => {
            rpc.call("aria2.addUri", [[uri], {}]).then(gid => {
                console.log("gid for new task: " + gid)
                return rpc.getAllTasks()
            }).then(tasks => {
                dispatch(receivedTasks(tasks)) 
            })
        },
        addTorrent: (rpc, torrent) => {
            rpc.call("aria2.addTorrent", [torrent, [], {}]).then(gid => {
                console.log("gid for new task: " + gid)
                return rpc.getAllTasks()
            }).then(tasks => {
                dispatch(receivedTasks(tasks))                
            })
        },
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(NewTaskDialog)