import { connect } from 'react-redux'
import { RootState } from '../reducer'
import TaskCategoryTabs, { StoreProps } from '../views/taskCategoryTabs'


function mapStateToProps(state: RootState): StoreProps {
    return {

    }
}

export default connect(mapStateToProps)(TaskCategoryTabs)