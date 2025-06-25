/* eslint-disable jsx-a11y/control-has-associated-label */

import { Link, useParams } from 'react-router-dom';
import { Person } from '../types';
import { getSearchWith } from '../utils/searchHelper';
import cn from 'classnames';
import { PersonLink } from './PersonLink';

type Props = {
  people: Person[];
  searchParams: URLSearchParams;
};

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'sex', label: 'Sex' },
  { key: 'born', label: 'Born' },
  { key: 'died', label: 'Died' },
] as const;

export const PeopleTable = ({ people, searchParams }: Props) => {
  const { personSlug } = useParams();

  const currentSort = searchParams.get('sort');
  const currentOrder = searchParams.get('order');

  const getSortLink = (key: string) => {
    const isSameColumn = currentSort === key;

    if (!isSameColumn) {
      return getSearchWith(searchParams, { sort: key });
    }

    if (isSameColumn && !currentOrder) {
      return getSearchWith(searchParams, { sort: key, order: 'desc' });
    }

    return getSearchWith(searchParams, { sort: null, order: null });
  };

  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          {COLUMNS.map(({ key, label }) => {
            const isActive = currentSort === key;
            const order = isActive ? currentOrder : null;

            return (
              <th key={key}>
                <span className="is-flex is-flex-wrap-nowrap">
                  {label}
                  <Link to={`?${getSortLink(key)}`}>
                    <span className="icon">
                      <i
                        className={cn('fas', {
                          'fa-sort': !isActive,
                          'fa-sort-up': isActive && !order,
                          'fa-sort-down': isActive && order,
                        })}
                      />
                    </span>
                  </Link>
                </span>
              </th>
            );
          })}
          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>

      <tbody>
        {people.map(person => (
          <tr
            key={person.slug}
            data-cy="person"
            className={cn({
              'has-background-warning': personSlug === person.slug,
            })}
          >
            <td>
              <PersonLink name={person.name} people={people} />
            </td>
            <td>{person.sex}</td>
            <td>{person.born}</td>
            <td>{person.died}</td>
            <td>
              <PersonLink name={person.motherName} people={people} />
            </td>
            <td>
              <PersonLink name={person.fatherName} people={people} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
