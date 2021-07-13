import css from './calendar.module.css'
import clsx from "clsx"
import { useMemo } from "react"
import { useCalendarContext } from './context'
import dayjs from 'dayjs'

export default function Day({day, onEventClick = _ => {}, onDayClick = _ => {}}) {
    let {getDayState, state: {rows}} = useCalendarContext()

    const state = getDayState(day)
    const classes = clsx({
        [css.today]: state.isToday,
        [css.dim]: !state.isThisMonth,
        [css.withMonth]: state.shouldDisplayMonth
    })

    const dayToDisplay = useMemo(() => {
        if (!day) return ''
        if (state.shouldDisplayMonth) return day.format('MMM D')

        return day.format('D')
    }, [day, state])

    const _onEventClick = e => {
        e.stopPropagation()
        onEventClick(state.events)
    }

    const sliceTo = rows === 5 ? 4 : 3
    const more = state.events.length - sliceTo

    return (
        <div className={css.day} onClick={onDayClick} >
            <div>
                <span className={classes} >
                    {dayToDisplay}
                </span>
            </div>

            <div>
                { state.events.slice(0, sliceTo).map((event, i) => {
                    let time = dayjs(event.startDate).format('h:mma')
                    let title = event.title

                    return (
                        <span className={css.event} key={i} onClick={_onEventClick}>
                            {time + ' '}
                            <span>{title}</span>
                        </span>
                    )
                })}

                { more > 0 && <span className={css.more} onClick={_onEventClick} >{more} more ...</span> }
            </div>
        </div>
    )
}