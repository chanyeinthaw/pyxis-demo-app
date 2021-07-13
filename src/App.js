import dayjs from "dayjs";
import { createContext, useContext, useEffect, useState } from "react";
import Scheduler from "./components/scheduler/scheduler";
import { generateUniqueId } from "./lib/generate-uuid"
import Dashboard from './components/dashboard/dashboard'

let AppContext = createContext(null)

function App() {
    const eventPopupData = {
        id: '', title: '', memo: '',
        place: '', link: '', person: '',
        startDate: '', endDate: ''
    }

    const [state, setState] = useState({
        targetDate: dayjs(),
        dashboardViewMode: 'events',
        userId: '',
        locale: 'en',
        events: [],
        eventPopup: {
            mode: 'hidden', // create | update
            day: null,
            data: eventPopupData
        },
        eventViewVisibility: false
    })

    useEffect(() => {
        const locale = localStorage.getItem('locale')
        const userId = localStorage.getItem('userId')

        setUserId(userId)
        setLocale(locale || 'en')

        // eslint-disable-next-line
    }, [])

    const openEventPopup = (mode = 'create', day, data) => {
        setState(state => {
            if (mode === 'create') {
                return {
                    ...state,
                    eventPopup: { ...state.eventPopup, mode, day }
                } 
            } 
            
            if (mode === 'update') {
                return {
                    ...state,
                    eventPopup: { ...state.eventPopup, mode, day: null, data: { ...data } }
                }
            }
        })
    }

    const closeEventPopup = () => {
        setState(state => ({
            ...state,
            eventPopup: {
                mode: 'hidden',
                day: null,
                data: eventPopupData
            }
        }))
    }

    const setEventPopupData = (data) => {
        setState(state => {
            return {
                ...state,
                eventPopup: {
                    ...state.eventPopup,
                    data: { ...state.eventPopup.data, ...data }
                }
            }
        })
    }

    const showEventPopup = state.eventPopup.mode !== 'hidden'
    const eventPopupMode = state.eventPopup.mode

    const showEventView = state.eventViewVisibility && state.events.length > 0

    const setTargetDate = date => setState(state => ({
        ...state,
        targetDate: date
    }))

    const setLocale = locale => {
        setState(state => ({
            ...state,
            locale
        }))

        localStorage.setItem('locale', locale)
    }

    const setUserId = (userId) => {
        userId = userId || generateUniqueId()

        setState(state => ({
            ...state,
            userId
        }))

        localStorage.setItem('userId', userId)
    }

    const setEventViewVisibility = (visibility, events = []) => setState(state => ({
        ...state,
        eventViewVisibility: visibility,
        events: [...events]
    }))

    const provide = {
        state, 
        setDashboardViewMode: (dashboardViewMode = 'events') => {
            setState(state => ({
                ...state,
                dashboardViewMode
            }))
        },
        eventPopup: {
            open: openEventPopup,
            close: closeEventPopup,
            mode: eventPopupMode,
            visible: showEventPopup,
            setData: setEventPopupData
        },
        showEventView, 
        setEventPopupDay: (day) => {
            setState(state => ({
                ...state,
                eventPopup: {
                    ...state.eventPopup,
                    day
                }
            }))
        },
        setLocale, 
        setEventViewVisibility,
        setTargetDate
    }

    return (
        <AppContext.Provider value={provide}>
            <ContextConsumedApp />
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}

function ContextConsumedApp() {
    let isDashboard = document.location.pathname === '/dashboard'
    return isDashboard ? <Dashboard /> : <Scheduler />
}

export default App;
