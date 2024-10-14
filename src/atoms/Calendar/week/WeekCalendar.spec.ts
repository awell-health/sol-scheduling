import { within, userEvent, expect } from '@storybook/test';

export const NoAvailabilitiesSpec = async ({
  canvasElement
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);
  const virtualButton = await canvas.findByRole('button', {
    name: 'Telehealth'
  });
  await userEvent.click(virtualButton);
  const mondayCard = await canvas.findByTestId('Mon Jan 01 2024');
  const tuesdayCard = await canvas.findByTestId('Tue Jan 02 2024');
  const wednesdayCard = await canvas.findByTestId('Wed Jan 03 2024');
  const thursdayCard = await canvas.findByTestId('Thu Jan 04 2024');
  const fridayCard = await canvas.findByTestId('Fri Jan 05 2024');
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
  const nextWeekButton = await canvas.findByLabelText('Go to next week');
  const prevWeekButton = await canvas.findByLabelText('Go to previous week');

  await userEvent.click(prevWeekButton);
  expect(
    await canvas.findByTestId('Mon Dec 25 2023'),
    'Dec 25 2023 should be visible'
  ).toBeVisible();
  await expect(
    prevWeekButton,
    'prevWeekButton should be disabled after one week previous'
  ).toBeDisabled();
  await userEvent.click(nextWeekButton);
  // back at jan 1
  await userEvent.click(nextWeekButton);
  expect(
    await canvas.findByTestId('Mon Jan 08 2024'),
    'Jan 08 2024 should be visible'
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
