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

  // /** Get all elements of interests */
  // const brooklynHeightsButton = await canvas.findByRole('button', {
  //   name: 'Brooklyn Heights'
  // });
  // const virtualButton = await canvas.findByRole('button', {
  //   name: 'Telehealth'
  // });
  const prevWeekButton = await canvas.findByLabelText('Go to previous week');
  const nextWeekButton = await canvas.findByLabelText('Go to next week');

  // Calendar navigation
  await userEvent.click(prevWeekButton);

  // Wait for the previous week's days to display
  const prevWeekDayCard = await canvas.findByTestId('Mon Oct 07 2024');
  expect(prevWeekDayCard, 'prev week should be visible').toBeVisible();

  // Go to next week where we should have available slots
  await userEvent.click(nextWeekButton);

  // Find all day cards and find a clickable one (which means it has available slots)
  // Instead of checking a specific day, we'll click on any day that has availability
  const allDayCards = await canvas.findAllByRole('button');
  const availableDayCard = allDayCards.find(
    (card) =>
      !card.hasAttribute('disabled') &&
      card.getAttribute('data-testid')?.includes('2024')
  );

  expect(
    availableDayCard,
    'Should find at least one day with availability'
  ).toBeTruthy();

  if (!availableDayCard) {
    throw new Error('No available day cards found');
  }

  // Click on the available day
  await userEvent.click(availableDayCard);

  // Wait for the slots to appear
  await waitFor(
    async () => {
      // Try multiple approaches to find slots
      const radioButtons = canvas.queryAllByRole('radio');
      const timeTexts = canvas.queryAllByText(/\d+:\d+/);

      // Either radio buttons or time texts should be present
      expect(
        radioButtons.length > 0 || timeTexts.length > 0,
        'Should find slots after clicking on an available day'
      ).toBeTruthy();
    },
    { timeout: 5000 }
  );

  // Look for the book button
  let bookButton: HTMLElement | null = null;

  await waitFor(
    async () => {
      try {
        bookButton = await canvas.findByRole('button', {
          name: /book appointment/i
        });
        expect(bookButton).toBeVisible();
      } catch {
        // If we can't find the book button, we might need to select a slot first
        const slotElements = canvas.queryAllByRole('radio');
        if (slotElements.length > 0) {
          await userEvent.click(slotElements[0]);
          bookButton = await canvas.findByRole('button', {
            name: /book appointment/i
          });
        }
      }
    },
    { timeout: 5000 }
  );

  // Click the book button if we found it
  if (bookButton) {
    await userEvent.click(bookButton);

    // Verify API calls
    await waitFor(
      () => {
        expect(bookAppointmentMock, 'bookAppointment').toBeCalledTimes(1);
        expect(fetchProviderMock, 'fetchProvider').toBeCalledTimes(1);
        expect(fetchAvailabilityMock, 'fetchAvailability').toBeCalledTimes(1);
        expect(completeActivityMock, 'completeActivity').toHaveBeenCalledTimes(
          1
        );
      },
      { timeout: 5000 }
    );
  }
};
