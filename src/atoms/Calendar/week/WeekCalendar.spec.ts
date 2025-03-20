import { within, userEvent, expect } from '@storybook/test';

/**
 * For all tests below, the current date is mocked to be 2024-10-14
 */

export const WithAvailabilitiesAndInPersonPreferenceSpec = async ({
  canvasElement
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);

  const physicalLocationFilter = await canvas.findByRole('button', {
    name: 'Brooklyn Heights'
  });

  expect(physicalLocationFilter).toHaveClass('sol-selected');

  const availableDay = await canvas.findByTestId('Tue Oct 15 2024');

  /**
   * There is only one In-Person slot available in our test data
   * Using a more specific approach to find slot text to avoid ambiguity with date numbers
   */
  // Look for an element that explicitly contains "slot" text to avoid confusing with day numbers
  const slotElements = within(availableDay).queryAllByText(/slot/i);
  expect(
    slotElements.length,
    `${availableDay.innerText.replace('\n', ' ')} should have a slot indicator`
  ).toBeGreaterThan(0);

  // Verify the slot count specifically mentions 1 slot
  const slotElement = slotElements.find((el) => el.textContent?.includes('1'));
  expect(
    slotElement,
    `${availableDay.innerText.replace('\n', ' ')} should have 1 slot`
  ).toBeTruthy();
};

export const NoAvailabilitiesSpec = async ({
  canvasElement
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);

  const prevWeekButton = await canvas.findByLabelText('Go to previous week');
  const nextWeekButton = await canvas.findByLabelText('Go to next week');

  await expect(
    prevWeekButton,
    'prevWeekButton should be disabled'
  ).toBeDisabled();

  // Current week should be visible
  expect(
    await canvas.findByTestId('Mon Oct 14 2024'),
    'Oct 14 2024 should be visible'
  ).toBeVisible();

  const virtualButton = await canvas.findByRole('button', {
    name: 'Telehealth'
  });
  expect(virtualButton).toHaveClass('sol-selected');

  await userEvent.click(virtualButton);
  const mondayCard = await canvas.findByTestId('Mon Oct 14 2024');
  const tuesdayCard = await canvas.findByTestId('Tue Oct 15 2024');
  const wednesdayCard = await canvas.findByTestId('Wed Oct 16 2024');
  const thursdayCard = await canvas.findByTestId('Thu Oct 17 2024');
  const fridayCard = await canvas.findByTestId('Fri Oct 18 2024');
  for (const card of [
    mondayCard,
    tuesdayCard,
    wednesdayCard,
    thursdayCard,
    fridayCard
  ]) {
    expect(
      await within(card).findByText('No slots'),
      `${card.innerText.replace('\n', ' ')} should have no slots`
    ).toBeTruthy();
  }

  // Go to next week
  await userEvent.click(nextWeekButton);
  expect(
    await canvas.findByTestId('Mon Oct 21 2024'),
    'Oct 21 2024 should be visible'
  ).toBeVisible();
  await userEvent.click(nextWeekButton);
  await userEvent.click(nextWeekButton);
  await userEvent.click(nextWeekButton);
  await userEvent.click(nextWeekButton);
  await expect(
    nextWeekButton,
    'nextWeekButton should be disabled after 5 weeks in advance'
  ).toBeDisabled();
};

export const CurrentWeekAvailabilitySpec = async ({
  canvasElement
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);

  const prevWeekButton = await canvas.findByLabelText('Go to previous week');

  await expect(
    prevWeekButton,
    'prevWeekButton should be disabled'
  ).toBeDisabled();

  // Current week should be visible
  expect(
    await canvas.findByTestId('Mon Oct 14 2024'),
    'Oct 14 2024 should be visible'
  ).toBeVisible();
};

export const NextWeekAvailabilitySpec = async ({
  canvasElement
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);

  // Next week should be visible
  expect(
    await canvas.findByTestId('Mon Oct 21 2024'),
    'Oct 21 2024 should be visible'
  ).toBeVisible();

  const prevWeekButton = await canvas.findByLabelText('Go to previous week');

  /**
   * First availability is week after this week and we do allow user
   * to go to the previous week, which is the current week.
   */
  await expect(
    prevWeekButton,
    'prevWeekButton should not be disabled'
  ).not.toBeDisabled();
};
