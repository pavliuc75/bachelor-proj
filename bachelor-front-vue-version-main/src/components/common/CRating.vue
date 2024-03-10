<template>
  <div class="flex flex-col" v-on="$listeners">
    <div class="flex items-center">
      <v-rating half-increments :value="value">
        <template v-slot:item="props">
        <span v-if="props.isHalfFilled" class="mr-1"
              data-test="half-star">
          <font-awesome-icon
            size="xs"
            icon="fa-solid fa-star-half"
            class="relative z-[1]"
          />
          <span class="c-invisible-wrapper inline-block">
            <font-awesome-icon
              size="xs"
              class="text-spun-pearl absolute right-0 bottom-0"
              icon="fa-solid fa-star"
            />
          </span>
        </span>
          <font-awesome-icon
            data-test="filled-star"
            class="mr-1"
            v-else-if="props.isFilled"
            size="xs"
            icon="fa-solid fa-star"
          />
          <font-awesome-icon
            data-test="empty-star"
            size="xs"
            v-else
            class="text-spun-pearl mr-1"
            icon="fa-solid fa-star"
          />
        </template>
      </v-rating>
      <div>
      <span v-if="isNumericRatingShown" class="c-text-12 ml-1" style="vertical-align: text-bottom" data-test="value">
        ({{ formattedValue }})
      </span>
      </div>
    </div>
    <div v-if="isTotalRatingShown" class="c-text-12 text-mid-gray leading-1.5">
      {{ totalRatings }} {{ $t("ratingsInTotal").toLowerCase() }}
    </div>
  </div>
</template>

<script>
import { stringFormatter } from "@/util/stringFormatter";

export default {
  name: "CRating",
  props: {
    value: {
      type: Number,
      required: true
    },
    totalRatings: {
      type: Number
    },
    isTotalRatingShown: {
      type: Boolean
    },
    isNumericRatingShown: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    formattedValue() {
      return stringFormatter.replaceDotsWithCommas(this.value);
    }
  }
};
</script>

<style scoped></style>
