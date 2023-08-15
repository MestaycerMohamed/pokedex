import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ResultComponent } from './result/result.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  
  { path : 'pokemon/:nameid',
    component : ResultComponent,
  },
  { path : '404',
  component : NotFoundComponent,
  },{ path : '**',
  component : SearchComponent,
  }
  
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
