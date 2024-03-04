import { component$ } from '@builder.io/qwik';
// TODO get the latest one?
import _teamData from '../../data/teams-2023-03-01.json';
import type { Team } from '../../types/Team';
import styles from './team-table.module.css';

const teamData: Team[] = _teamData;

export default component$(() => {
  return (
    <table class={styles.root}>
      <thead>
        <tr>
          {teamData.map((team) => (
            <th key={team.owner}>
              {team.owner}'s <em class={styles.teamName}>{team.name}</em>
              <br />
              {team.totalPoints} points
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(10)].map((_, i) => (
          <tr key={i}>
            {teamData.map((team) => {
              const rider = team.riders[i];
              return (
                <td key={rider.name}>
                  {rider.name} <strong>{rider.totalPoints || 0}</strong>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
});
