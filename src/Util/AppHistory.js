import { useRouterHistory } from 'react-router';

import createBrowserHistory from 'history/lib/createBrowserHistory'
import useScroll from 'scroll-behavior/lib/useStandardScroll'

const AppHistory = useScroll(useRouterHistory(createBrowserHistory))();

module.exports = AppHistory;