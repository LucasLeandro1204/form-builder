<template>
  <header class="editor-app-header">
    <div class="editor-app-header-grid">

      <div class="grid-item">
        <div class="sub-grid title-grid-item">
          <div class="sub-grid-item editor-app-close-item">
            <span class="close-symbol">&#x2715;</span>
          </div>
          <div class="sub-grid-item">
            <div class="editor-app-header-title">
              <h1 class="text-title">Form Builder</h1>
              <p class="text-sub-title">Add and customize forms for your needs</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-item app-header-navigation">
        <nav class="editor-app-navigation">
          <ul class="navigation-list">
            <li class="active"><a class="navigation-link">Fields</a></li>
            <li><a class="navigation-link">Workflow</a></li>
            <li><a class="navigation-link">Permissions</a></li>
          </ul>
        </nav>
      </div>

      <div class="grid-item app-header-workspace">
        <div class="editor-app-last-saved">
          <div class="sub-grid">
            <div class="sub-grid-item">
              <span class="text-secondary nowrap">Changes saved 2 mins ago</span>
            </div>
            <div class="sub-grid-item">
              <div class="symbol-item">
                <span class="eye-symbol">&#128065;</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </header>
</template>

<script setup>
</script>

<style lang="scss">
@import "../../../scss/abstracts/index";

.editor-app-header {
  grid-column: 1/-1;
  height: rem-calc(80);
  background: #FFFFFF;
  box-shadow: 0 rem-calc(4) rem-calc(2) rem-calc(-2) #d0d0d0;
  z-index: 99;
}

.navigation-list {
  padding: rem-calc(4) rem-calc(2);
  border-radius: rem-calc(12);
  background: #ececec;
  list-style-type: none;
  display: inline-flex;

  li.active {
    background: #FFFFFF;
  }

  .navigation-link {
    height: 100%;
    width: 100%;
    cursor: pointer;
    padding: rem-calc(8) rem-calc(16);
    text-align: center;
    font-size: rem-calc(16);
    font-weight: 600;
    color: #0a284b;
    line-height: initial;
  }

  > li {
    border-radius: rem-calc(8);
    margin: 0 rem-calc(4);
  }

}


.close-icon {
  $size: rem-calc(18);
  height: $size;
  width: $size;
  cursor: pointer;
  user-select: none;
}

.editor-app-header-title {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 rem-calc(22);
  flex-direction: column;
}

.symbol-item {
  padding: rem-calc(8);
  border-radius: rem-calc(6);
  position: relative;
  background: rgba(81, 127, 180, 0.37);
  cursor: pointer;

  .eye-symbol {
    position: relative;
    top: rem-calc(1);
    font-size: rem-calc(18);
    color: #092b52;
  }
}

.text-secondary {
  font-weight: 500;
  letter-spacing: 0.1px
}

.text-title {
  font-weight: 600;
  font-size: rem-calc(22);
  line-height: 1.5;
  margin: 0;
}

.text-sub-title {
  font-weight: 600;
  color: #484848;
  font-size: rem-calc(14);
}

.nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.close-symbol {
  font-size: 2em;
  cursor: pointer;
}


.app-header-workspace {
  justify-content: flex-end;
  padding: 0 rem-calc(28);
}

.app-header-navigation {
  justify-content: center;
}

.editor-app-header-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  position: relative;
  height: 100%;
  width: 100%;

  .grid-item {
    display: flex;
    align-items: center;
  }

  .title-grid-item {
    grid-template-columns: 1fr 4fr;

    .sub-grid-item:first-child {
      border-left: #8899a6 solid rem-calc(1);

      @include set-breakpoint(tablet, down) {
        display: none;
      }

      &::after {
        content: '';
        position: absolute;
        right: 0;
        height: 65%;
        width: rem-calc(1);
        background: rgba(0, 0, 0, 0.32);
        border-radius: rem-calc(12);
      }
    }
  }

  .sub-grid {
    width: 100%;
    height: 100%;
    display: grid;
    justify-items: center;

    .sub-grid-item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      position: relative;

      &.close {
        background: #8899a6;
      }

      &.title {
        background: #20C08D;
      }

    }
  }
}


.editor-app-header-title {

  @include set-breakpoint(tablet, down) {
    display: none;
  }
}

.editor-app-close-item {
  @include set-breakpoint(tablet, down) {
    display: none;
  }
}

.editor-app-header-options {

}

.editor-app-last-saved {
  width: 100%;
  max-width: rem-calc(220);
  height: 100%;

  @include set-breakpoint(tablet, down) {
    display: none;
  }

  .sub-grid {
    justify-items: center;
    grid-template-columns: 1fr 1fr;
  }

  .sub-grid-item {
    &:nth-child(1) {
    }

    &:nth-child(1) {

    }
  }
}
</style>