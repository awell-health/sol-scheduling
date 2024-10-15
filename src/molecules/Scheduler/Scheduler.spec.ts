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
  const cherryCreekButton = await canvas.findByRole('button', {
    name: 'Cherry Creek'
  });
  const unionSquareButton = await canvas.findByRole('button', {
    name: 'Union Square'
  });
  const virtualButton = await canvas.findByRole('button', {
    name: 'Telehealth'
  });
  const prevWeekButton = await canvas.findByLabelText('Go to previous week');
  const nextWeekButton = await canvas.findByLabelText('Go to next week');

  // Calendar navigation
  await userEvent.click(prevWeekButton);
  const prevWeekDayCard = await canvas.findByTestId('Mon Dec 25 2023');
  expect(prevWeekDayCard, 'prev week should be visible').toBeVisible();
  await userEvent.click(nextWeekButton);

  // Default state (Virtual)
  const mondayCard = await canvas.findByTestId('Mon Jan 01 2024');
  const tuesdayCard = await canvas.findByTestId('Tue Jan 02 2024');

  expect(
    await within(mondayCard).findByText('2 slots'),
    'monday should have 2 slots'
  ).toBeTruthy();
  expect(
    await within(tuesdayCard).findByText('3 slots'),
    'tuesday should have three slots'
  ).toBeTruthy();

  // Cherry Creek
  await userEvent.click(cherryCreekButton);

  expect(
    await within(mondayCard).findByText('1 slot'),
    'monday should have 1 slot'
  ).toBeTruthy();
  expect(
    await within(tuesdayCard).findByText('1 slot'),
    'tuesday should have 1 slot'
  ).toBeTruthy();

  // Union Square
  await userEvent.click(unionSquareButton);
  expect(
    await within(mondayCard).findByText('No slots'),
    'monday should have no slots'
  ).toBeTruthy();
  expect(
    await within(tuesdayCard).findByText('1 slot'),
    'tuesday should have 1 slot'
  ).toBeTruthy();

  // Go back to virtual and let's test the slots
  await userEvent.click(virtualButton);
  await userEvent.click(mondayCard);
  const slotsContainer = await canvas.findByTestId('slots');
  await expect(slotsContainer.children.length).toBe(2); // Monday has 2 slots
  await userEvent.click(tuesdayCard);
  await expect(slotsContainer.children.length).toBe(3); // Tuesday has 3 slots

  const elevenAmSlot = (await slotsContainer.querySelector(
    '[aria-label="2024-01-02T10:00:00.000Z"]'
  )) as HTMLElement;

  if (elevenAmSlot === null) {
    throw new Error('No 10 AM (UTC) slot found');
  }

  await userEvent.click(elevenAmSlot);

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
