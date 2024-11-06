import { within, userEvent, expect, waitFor } from '@storybook/test';
import {
  bookAppointmentMock,
  completeActivityMock,
  fetchAvailabilityMock,
  fetchProviderMock
} from './__mocks__/scheduler.mocks';

export const SchedulerSpec = async ({
  canvasElement
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);

  /** Get all elements of interests */
  const brooklynHeightsButton = await canvas.findByRole('button', {
    name: 'Brooklyn Heights'
  });
  const virtualButton = await canvas.findByRole('button', {
    name: 'Telehealth'
  });
  const prevWeekButton = await canvas.findByLabelText('Go to previous week');
  const nextWeekButton = await canvas.findByLabelText('Go to next week');

  // Calendar navigation
  await userEvent.click(prevWeekButton);
  const prevWeekDayCard = await canvas.findByTestId('Mon Oct 07 2024');
  expect(prevWeekDayCard, 'prev week should be visible').toBeVisible();
  await userEvent.click(nextWeekButton);

  // Default state (Virtual)
  const thursdayCard = await canvas.findByTestId('Thu Oct 17 2024');
  expect(thursdayCard, 'thursday card should be visible').toBeVisible();
  expect(
    await within(thursdayCard).findByText('1 slot'),
    'Thursday should have 1 slot'
  ).toBeTruthy();

  await userEvent.click(nextWeekButton);
  const nextMondayCard = await canvas.findByTestId('Mon Oct 21 2024');
  expect(nextMondayCard, 'next monday card should be visible').toBeVisible();

  expect(
    await within(nextMondayCard).findByText('2 slots'),
    'monday the 21st should have two slots'
  ).toBeTruthy();

  // In-person
  await userEvent.click(brooklynHeightsButton);

  expect(
    await within(nextMondayCard).findByText('1 slot'),
    'monday should have 1 slot'
  ).toBeTruthy();

  // Virtual
  await userEvent.click(virtualButton);

  await userEvent.click(nextMondayCard);
  const nextWeekSlotsContainer = await canvas.findByTestId('slots');
  await expect(nextWeekSlotsContainer.children.length).toBe(2); // Monday has 2 slots
  await userEvent.click(prevWeekButton);

  const thursdayCard2 = await canvas.findByTestId('Thu Oct 17 2024');
  await userEvent.click(thursdayCard2);
  const thisWeekSlotsContainer = await canvas.findByTestId('slots');
  await expect(thisWeekSlotsContainer.children.length).toBe(1); // Thursday has 1 slot

  const slotToBook = (await thisWeekSlotsContainer.querySelector(
    '[aria-label="2024-10-17T21:00:00.000Z"]'
  )) as HTMLElement;

  if (slotToBook === null) {
    throw new Error('No 9 PM (UTC) slot found');
  }

  await userEvent.click(slotToBook);

  const bookButton = await canvas.findByRole('button', {
    name: 'Confirm booking'
  });

  expect(bookButton).toBeVisible();
  await userEvent.click(bookButton);

  await waitFor(
    () => {
      expect(bookAppointmentMock, 'bookAppointment').toBeCalledTimes(1);
      expect(fetchProviderMock, 'fetchProvider').toBeCalledTimes(1);
      expect(fetchAvailabilityMock, 'fetchAvailability').toBeCalledTimes(1);
      expect(completeActivityMock, 'completeActivity').toHaveBeenCalledTimes(1);
    },
    { timeout: 5000 }
  );
};
