import { Paper } from './book/Paper'
import { Endpaper } from './book/Cover'
import { DayLeft, DayRight } from './pages/DayPages'
import { CompareLeft, CompareRight } from './pages/ComparePages'
import { TitlePage } from './pages/FrontPages'
import { ProgressChart, ProgressHeatmap, ProgressStats, ProgressTags } from './pages/ProgressPages'
import { IndexLeft, IndexRight } from './pages/IndexPages'
import { locationKey, pageNumbers } from '../lib/locations'

function contentFor(loc) {
  switch (loc.view) {
    case 'front':
      return { left: null, right: <TitlePage />, endpaper: true }
    case 'day':
      return { left: <DayLeft date={loc.date} />, right: <DayRight date={loc.date} /> }
    case 'compare':
      return { left: <CompareLeft />, right: <CompareRight /> }
    case 'progress':
      return loc.page === 1
        ? { left: <ProgressHeatmap />, right: <ProgressTags />, plain: true }
        : { left: <ProgressStats />, right: <ProgressChart />, plain: true }
    default:
      return { left: <IndexLeft />, right: <IndexRight /> }
  }
}

/** Turns a location into page elements: two pages on desktop, one on mobile. */
export function buildSpread(loc, { isDesktop, dates, owner }) {
  const key = locationKey(loc)
  const c = contentFor(loc)
  const [ln, rn] = pageNumbers(loc, dates)
  const ruled = !c.plain
  if (isDesktop) {
    return {
      left: c.endpaper ? (
        <Endpaper owner={owner} side="left" />
      ) : (
        <Paper side="left" seed={`${key}-l`} number={ln} ruled={ruled} margin={ruled}>
          {c.left}
        </Paper>
      ),
      right: (
        <Paper side="right" seed={`${key}-r`} number={rn} ruled={ruled && !c.endpaper} margin={!c.endpaper && ruled} decor={!c.endpaper}>
          {c.right}
        </Paper>
      ),
    }
  }
  return {
    single: (
      <Paper side="single" seed={key} number={rn} ruled={ruled && !c.endpaper} margin={!c.endpaper && ruled} decor={!c.endpaper}>
        {c.left}
        {c.left && (
          <div className="my-[30px] flex justify-center text-sepia/60" aria-hidden>
            ✦ ✦ ✦
          </div>
        )}
        {c.right}
      </Paper>
    ),
  }
}
