import cn from 'classnames';
import { Link, SetURLSearchParams } from 'react-router-dom';
import { getSearchWith } from '../utils/searchHelper';

interface Props {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

const SEX_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Male', value: 'm' },
  { label: 'Female', value: 'f' },
];

const CENTURY_FILTERS = [16, 17, 18, 19, 20];

export const PeopleFilters = ({ searchParams, setSearchParams }: Props) => {
  const query = searchParams.get('query') || '';
  const sex = searchParams.get('sex') || '';
  const selectedCenturies = searchParams.getAll('centuries');

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const params = new URLSearchParams(searchParams);

    params.set('query', event.target.value);
    setSearchParams(params);
  }

  function getCenturySearchString(century: number) {
    const centuryStr = century.toString();
    const hasCentury = selectedCenturies.includes(centuryStr);

    const newListOfCenturies = hasCentury
      ? selectedCenturies.filter(selectedCent => selectedCent !== centuryStr)
      : [...selectedCenturies, centuryStr];

    const search = getSearchWith(searchParams, {
      centuries: newListOfCenturies,
    });

    return search;
  }

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs" data-cy="SexFilter">
        {SEX_FILTERS.map(({ label, value }) => (
          <Link
            key={label}
            className={cn({ 'is-active': sex === value })}
            to={`?${getSearchWith(searchParams, { sex: value })}`}
          >
            {label}
          </Link>
        ))}
      </p>

      <div className="panel-block">
        <p className="control has-icons-left">
          <input
            data-cy="NameFilter"
            type="search"
            className="input"
            placeholder="Search"
            value={query}
            onChange={event => handleQueryChange(event)}
          />

          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>
        </p>
      </div>

      <div className="panel-block">
        <div className="level is-flex-grow-1 is-mobile" data-cy="CenturyFilter">
          <div className="level-left">
            {CENTURY_FILTERS.map(century => {
              const hasCentury = selectedCenturies.includes(century + '');

              return (
                <Link
                  key={century}
                  data-cy="century"
                  className={cn('button mr-1', { 'is-info': hasCentury })}
                  to={`?${getCenturySearchString(century)}`}
                >
                  {century}
                </Link>
              );
            })}
          </div>

          <div className="level-right ml-4">
            <Link
              data-cy="centuryALL"
              className={cn('button is-success', {
                'is-outlined': searchParams.getAll('centuries').length,
              })}
              to={`?${getSearchWith(searchParams, { centuries: null })}`}
            >
              All
            </Link>
          </div>
        </div>
      </div>

      <div className="panel-block">
        <Link
          className="button is-link is-outlined is-fullwidth"
          to={{ pathname: '/people', search: '' }}
        >
          Reset all filters
        </Link>
      </div>
    </nav>
  );
};
