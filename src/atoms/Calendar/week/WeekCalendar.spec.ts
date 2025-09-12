import { within, expect } from '@storybook/test';

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

  const prevButton = await canvas.findByLabelText('Go to previous week');
  const nextButton = await canvas.findByLabelText('Go to next week');

  await expect(
    prevButton,
    'prevButton should be disabled when no availabilities'
  ).toBeDisabled();

  await expect(
    nextButton,
    'nextButton should be disabled when no availabilities'
  ).toBeDisabled();

  // With no availabilities, no day cards should be rendered
  // The grid should be empty
  const dayCards = canvas.queryAllByRole('button', { name: /.*/ });
  const dayTestIds = dayCards.filter((card) =>
    card.getAttribute('data-testid')?.includes('2024')
  );

  expect(
    dayTestIds.length,
    'No day cards should be rendered when there are no availabilities'
  ).toBe(0);
};

export const CurrentWeekAvailabilitySpec = async ({
  canvasElement
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);

  const prevButton = await canvas.findByLabelText('Go to previous week');

  await expect(
    prevButton,
    'prevButton should be disabled (at start of available dates)'
  ).toBeDisabled();

  // Since the component now only shows available dates, we should check for the availability dates
  // From the test story, we have availabilities on 2024-10-15 (Tuesday) and 2024-10-22 (Tuesday)
  expect(
    await canvas.findByTestId('Tue Oct 15 2024'),
    'Oct 15 2024 should be visible (first available date)'
  ).toBeVisible();
};

export const NextWeekAvailabilitySpec = async ({
  canvasElement
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);

  // The component now shows dates with availabilities, starting from the first available date
  // From the test story, we have availabilities on 2024-10-21 and 2024-10-28
  expect(
    await canvas.findByTestId('Mon Oct 21 2024'),
    'Oct 21 2024 should be visible (first available date)'
  ).toBeVisible();

  const prevButton = await canvas.findByLabelText('Go to previous week');

  /**
   * Since we're starting from the first availability date and there are no earlier
   * available dates, the previous button should be disabled
   */
  await expect(
    prevButton,
    'prevButton should be disabled at the start of available dates'
  ).toBeDisabled();
};
