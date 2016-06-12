import {
  Router,
  Route,
  IndexRoute,
  Redirect,
  IndexRedirect
} from 'react-router'

import BlogHome from './components/BlogHome'

import AppContainer from './containers/AppContainer'

import BlogPage from './pages/BlogPage'
import AppListPage from './pages/AppListPage'
import PhotoPage from './pages/PhotoPage'
import NotFoundPage from './pages/NotFoundPage'

const renderRoutes = () => (
  <Route path="/" component={AppContainer}>
    <IndexRedirect to="/note-blog"/>
    <Route path="note-blog" component={BlogPage}>
      <IndexRoute component={BlogHome}/>
    </Route>
    <Route path="app-list" component={AppListPage}/>
    <Route path="photo" component={PhotoPage}/>
    <Route path="*" component={NotFoundPage} onEnter={() => alert('This page has not ready yet!')}/>
  </Route>
)

export default renderRoutes