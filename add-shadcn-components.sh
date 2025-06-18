#!/bin/bash

components=(
  alert
  badge
  avatar
  alert-dialog
  button
  calendar
  card
  carousel
  popover
  skeleton
  sonner
  switch
  combobox
  date-picker
  data-table
  hover-card
  navigation-menu
  pagination
)

for c in "${components[@]}"; do
  npx shadcn@latest add $c
done
