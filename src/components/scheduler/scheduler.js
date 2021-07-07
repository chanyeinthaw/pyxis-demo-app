import Calendar from '../calendar/calendar'
import css from './scheduler.module.css'
import {Button, Select} from 'semantic-ui-react'
import _strings from './strings'
import dayjs from 'dayjs'
import { useAppContext } from '../../App'
import Events from '../events/events'
import { useEffect, useRef } from 'react'
import EventPopup from '../event-popup/event-popup'

export default function Scheduler() {
    const {state: {locale, targetDate, events, eventPopup: _eventPopup}, showEventView, setEventViewVisibility, eventPopup} = useAppContext()
    const eventController = useRef({})

    const onDayClick = day => {
        eventPopup.open('create', day.format('YYYY-MM-DD'))
    }

    const onSave = (mode, data) => {
        if (!eventController.current) return
        let date = dayjs(data.startDate).format('YYYY-MM-DD')

        if (mode === 'create') {
            eventController.current.create(data)
        } else {
            eventController.current.update({
                id: _eventPopup.data.id,
                date: date
            }, data)
        }

        setEventViewVisibility(false)
        eventPopup.close()
    }

    const onDelete = (id, date) => {
        if (!eventController.current) return
        eventController.current.delete({id, date})

        setEventViewVisibility(false)
        eventPopup.close()
    }

    return (
        <div className={css.scheduler} >
            <ControlBar />
            <Calendar ref={eventController} locale={locale} targetDate={targetDate.format('YYYY-MM-DD')} onEventClick={events => setEventViewVisibility(true, events)} onDayClick={onDayClick} />
            { showEventView && <Events eventController={eventController}/> }
            <EventPopup onSave={onSave} onDelete={onDelete} />
        </div>
    )
}

function ControlBar() {
    const {state: {locale, targetDate}, setLocale, setTargetDate} = useAppContext()
    const strings = _strings[locale]

    const loader = (pivot = 0) => _ => {
        let date = pivot === 0 ? dayjs() : targetDate

        setTargetDate(date.add(pivot, 'month'))
    }

    const languages = [{ key: 'jp', value: 'jp', text: 'JP'}, { key: 'en', value: 'en', text: 'EN'}]

    return ( <div className={css.controls} > 
        <div>
            <Button color='blue' onClick={loader()}>
                {strings.today}
            </Button>

            <Button icon='angle left' onClick={loader(-1)}/>
            <Button icon='angle right' onClick={loader(1)} />

            <span className={css.date} >{targetDate.format('MMM YYYY')}</span>
        </div>

        {/* <Select 
            onChange={(e, {value}) => setLocale(value)}
            options={languages} 
            value={locale} className={css.languages} /> */}
    </div> )
}