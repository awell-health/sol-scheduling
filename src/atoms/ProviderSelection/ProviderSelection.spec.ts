import { within, userEvent, expect } from '@storybook/test';

export const ProviderSelectionSpec = async ({
  canvasElement
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);
  const genderButton = await canvas.findByRole('button', {
    name: 'Gender'
  });
  const clinicalFocusButton = await canvas.findByRole('button', {
    name: 'Clinical Focus'
  });
  const deliveryMethodButton = await canvas.findByRole('button', {
    name: 'Delivery'
  });
  const stateButton = await canvas.findByRole('button', {
    name: 'State'
  });
  const facilityButton = await canvas.findByRole('button', {
    name: 'Facility'
  });
  const timeOfTheDayButton = await canvas.findByRole('button', {
    name: 'Time of Day'
  });
  const therapeuticModality = await canvas.findByRole('button', {
    name: 'Service'
  });
  const languageButton = await canvas.findByRole('button', {
    name: 'Language'
  });
  const insuranceButton = await canvas.findByRole('button', {
    name: 'Insurance'
  });

  const testApplyFilter = async ({
    button,
    filterName,
    autoClose
  }: {
    button: HTMLElement;
    filterName: string;
    autoClose?: boolean;
  }) => {
    await expect(button).toHaveClass('sol-border-slate-200');
    await userEvent.click(button);
    const closeButton = await canvas.findByLabelText('Close filter');
    await expect(closeButton).toBeVisible();
    const filterButton = await canvas.findByRole('button', {
      name: filterName
    });
    await expect(filterButton).toHaveTextContent(filterName);
    await userEvent.click(filterButton);
    if (!autoClose) {
      await expect(filterButton).toHaveClass('sol-ring-secondary');
      await userEvent.click(closeButton);
    }
    await expect(filterButton).not.toBeVisible();
    await expect(button).toHaveClass('sol-ring-secondary');
    await expect(button).toHaveClass('sol-text-primary');
    // const clearFilter = await canvas.findByLabelText(
    //   `Clear ${buttonText} filter`
    // );
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // await userEvent.click(clearFilter);
    // await expect(button).toHaveClass('sol-border-slate-200');
  };
  await testApplyFilter({
    button: genderButton,
    filterName: 'Female',
    autoClose: true
  });
  await testApplyFilter({
    button: clinicalFocusButton,
    filterName: 'ADHD'
  });
  await testApplyFilter({
    button: deliveryMethodButton,
    filterName: 'In-Person',
    autoClose: true
  });
  await testApplyFilter({
    button: stateButton,
    filterName: 'Colorado',
    autoClose: true
  });
  await testApplyFilter({
    button: facilityButton,
    filterName: 'Cherry Creek',
    autoClose: true
  });
  await testApplyFilter({
    button: timeOfTheDayButton,
    filterName: 'Morning',
    autoClose: true
  });
  await testApplyFilter({
    button: therapeuticModality,
    filterName: 'Therapy',
    autoClose: true
  });
  await testApplyFilter({
    button: languageButton,
    filterName: 'Spanish',
    autoClose: true
  });
  await testApplyFilter({
    button: insuranceButton,
    filterName: 'Aetna',
    autoClose: true
  });
};
