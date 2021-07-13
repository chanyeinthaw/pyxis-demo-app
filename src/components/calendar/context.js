import { createContext, forwardRef, useCallback, useContext, useState } from "react";
import dayjs from 'dayjs'
import { generateUniqueId } from "../../lib/generate-uuid";

let CalendarContext = createContext(null)

function useCalendarState() {
    const [state, setState] = useState({
        calendar: {},
        days: Array(35).fill(null),
        rows: 5,
    })

    const getDayState = useCallback((day) => {
        return !day ? { events: [] } : state.calendar[day.format('YYYY-MM-DD')]
    }, [state])

    const load = useCallback((target = null) => {
        const format = 'YYYY-MM-DD'
        const today = dayjs()
        const date = (target ? dayjs(target) : dayjs()).startOf('month')
        const daysInMonth = date.daysInMonth()
        const startIndex = date.format('d')

        const days = []
        for(let i = startIndex; i > 0; i--) {
            days.push(
                date.clone()
                    .add(-i, 'day')
            )
        }

        days.push(date)
        for(let i = 1; i < daysInMonth; i++) {
            days.push(
                date.clone()
                    .add(i, 'day')
            )
        }
        
        const length = days.length
        const pivot = length > 35 ? 42 - length : 35 - length;

        for(let i = 0; i < pivot ; i++) {
            days.push(
                days[days.length - 1].clone().add(1, 'day')
            )
        }

        let calendarStateObject = {}
        for(let day of days) {
            const key = day.format(format)

            const keyMM = day.format('MM')
            const todayMM = date.format('MM')
            const keyD = +day.format('D')

            const shouldDisplayMonth = keyD === 1

            calendarStateObject[key] = {
                shouldDisplayMonth,
                isThisMonth: keyMM === todayMM,
                isToday: today.format(format) === key,
                events: [],
            }
        }

        setState(state => ({
            ...state,
            calendar: calendarStateObject,
            days: [...days],
            rows: days.length / 7
        }))
    }, [setState])

    const loadCalendar = () => {
        let calendar = JSON.parse(localStorage.getItem('calendar'))
        if (!calendar) return
        setState(state => ({
            ...state,
            calendar: {
                ...state.calendar,
                ...calendar
            }
        }))
    }

    const persistCalendar = () => localStorage.setItem('calendar', JSON.stringify(state.calendar))

    const createEvent = ({ startDate, endDate, title, memo, person, place, link, userId }) => {
        const date = dayjs(startDate).format('YYYY-MM-DD')
        let created
        setState(state => {
            let calendar = { ...state.calendar }
            created = {
                id: generateUniqueId(),
                startDate, endDate,
                title, memo,
                person, place,
                link, userId
            }
            calendar[date].events.push(created)

            return {
                ...state,
                calendar
            }
        })

        persistCalendar()

        return created
    }

    const deleteEvent = ({date, id}) => {
        let day = state.calendar[date]
        if (!day) return false

        let event = day.events.filter(event => event.id === id)
        event = event.pop()

        if (!event) return false        
        setState(state => {
            let calendar = { ...state.calendar }
            let events = calendar[date].events.filter(event => event.id !== id)
            calendar[date].events = events

            return {
                ...state,
                calendar
            }
        })

        persistCalendar()

        return event
    }

    const updateEvent = ({date, id}, { startDate, endDate, title, memo, person, place, link, userId }) => {
        if (deleteEvent({id, date})) {
            createEvent({ startDate, endDate, title, memo, person, place, link, userId })

            return true
        }
    }
    
    const getAllEvents = () => {
        let events = []
        let days = Object.keys(state.calendar)

        for(let date of days) {
            events.push(...state.calendar[date].events)
        }
        
        return events
    }

    const getEventsOfUserAtDate = (userId, date) => {
        return (state.calendar[date] || {events: []}).events.filter(event => event.userId === userId)
    }

    const getEventsAt = (date) => {
        return (state.calendar[date] || {events: []} ).events
    }

    return { state, load, getDayState, loadCalendar, Event: {
        create: createEvent,
        update: updateEvent,
        delete: deleteEvent,
        all: getAllEvents,
        at: getEventsAt,
        ofUserAt: getEventsOfUserAtDate
    } }
}

export function useCalendarContext() {
    return useContext(CalendarContext)
}

export const withCalendarContext = Component => {
    Component = forwardRef(Component)
    function ContextAwareCalendar({...props}, ref) {
        const calendarState = useCalendarState()
    
        return (
            <CalendarContext.Provider value={calendarState}>
                <Component {...props} ref={ref} />
            </CalendarContext.Provider>
        )
    }

    return ContextAwareCalendar
}