import clsx from 'clsx'
import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import css from './calendar.module.css'
import { useCalendarContext, withCalendarContext } from './context'
import Day from './day'
import _strings from './strings'

function Calendar({locale = 'en', targetDate = null, onEventClick = events => {}, onDayClick = day => {}}, ref) {
    let {state: {days, rows}, load, loadCalendar, Event } = useCalendarContext()
    let strings = _strings[locale]

    useEffect(() => {
        load(targetDate)
        loadCalendar()

        // eslint-disable-next-line
    }, [targetDate, load])

    useImperativeHandle(ref, () => Event)

    return (
        <div className={clsx(css.calendar, { [css.calendar6]: rows === 6 })} >
            {
                strings.days.map(day => <Title key={day}>{day}</Title>)
            }

            {
                days.map((day, i) => {
                    return (
                        <Day 
                            key={i} 
                            day={day} 
                            onDayClick={_ => onDayClick(day)}
                            onEventClick={events => onEventClick(events)} />
                    )
                })
            }
        </div>
    )
}

export default forwardRef(withCalendarContext(Calendar))

function Title({children}) {
    return (
        <span className={css.title}>
            {children}
        </span>
    )
}